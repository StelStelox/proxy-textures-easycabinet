use std::{fs, process::exit};
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
pub struct Config {
    pub hostname: String,
    pub port: u16,
    pub database_url: String,
    pub storage: String,
    pub backend_url: String,
    pub s3_url: String,
    pub s3_bucket: String
}


pub fn get_config() -> Config {
    match fs::read_to_string("config.json") {
        Ok(content) => serde_json::from_str::<Config>(&content).unwrap(),
        Err(_) => {
            let create_file: Config = Config { 
                hostname: String::from("127.0.0.1"), 
                port: 3000, 
                database_url: String::from("mysql://root:password@127.0.1:3306/db"), 
                storage: String::from("backend"), 
                backend_url: String::from("http://127.0.0.1:4000"), 
                s3_url: String::from("http://127.0.0.1:9000"), 
                s3_bucket: String::from("cabinet"),
            };
            fs::write("config.json", serde_json::to_string_pretty(&create_file).unwrap()).expect("Error create config file, check permission textures proxy program");
            println!("Textures proxy program created config file, check it");
            exit(1);
        }
    }
}
