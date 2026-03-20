use serde::Serialize;
use std::fs;
use std::path::PathBuf;

#[derive(Debug, Serialize)]
pub enum TokenError {
    FileNotFound(String),
    IoError(String),
}

#[tauri::command]
pub fn get_token_path() -> String {
    let home = std::env::var("HOME").unwrap_or_else(|_| ".".to_string());
    format!("{}/.config/caw/api_key", home)
}

#[tauri::command]
pub fn read_api_token() -> Result<String, String> {
    let path_str = get_token_path();
    let path = PathBuf::from(&path_str);

    if !path.exists() {
        return Err(format!("Token file not found at: {}", path_str));
    }

    match fs::read_to_string(path) {
        Ok(token) => Ok(token.trim().to_string()),
        Err(e) => Err(format!("Failed to read token: {}", e)),
    }
}
