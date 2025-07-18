use crate::config::get_config;
use axum::{
    Router,
    extract::Path,
    http::{HeaderMap, HeaderValue, StatusCode},
    response::IntoResponse,
    routing::get,
};
use reqwest::Client;
use sqlx::prelude::FromRow;
mod config;

#[tokio::main]
async fn main() {
    let config = get_config();

    let app = Router::new()
        .route("/skin-{username}", get(get_skin))
        .route("/cape-{username}", get(get_cape));

    let listener = tokio::net::TcpListener::bind(format!("{}:{}", config.hostname, config.port))
        .await
        .unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn get_skin(Path(username): Path<String>) -> Result<impl IntoResponse, (StatusCode, String)> {
    let data = get_hash(&username).await.unwrap();
    if data.is_none() {
        return Err((
            StatusCode::NOT_FOUND,
            format!("User {} not found", username),
        ));
    }

    let user = data.unwrap();
    let hash = user.skin_hash.ok_or((
        StatusCode::NOT_FOUND,
        format!("Skin for user {} not found", username),
    ))?;

    let config = get_config();
    let url = format!(
        "{}/uploads/skin/{}/{}",
        config.backend_url,
        &hash[0..2],
        hash
    );

    let response = Client::builder()
        .build()
        .unwrap()
        .get(url)
        .send()
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
        .bytes()
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let mut header = HeaderMap::new();
    header.insert("Content-Type", HeaderValue::from_static("image/png"));

    Ok((StatusCode::OK, header, response))
}

async fn get_cape(Path(username): Path<String>) -> Result<impl IntoResponse, (StatusCode, String)> {
    let data = get_hash(&username).await.unwrap();
    if data.is_none() {
        return Err((
            StatusCode::NOT_FOUND,
            format!("User {} not found", username),
        ));
    }

    let user = data.unwrap();
    let hash = user.cape_hash.ok_or((
        StatusCode::NOT_FOUND,
        format!("Skin for user {} not found", username),
    ))?;
    let config = get_config();
    let url = format!(
        "{}/uploads/cape/{}/{}",
        config.backend_url,
        &hash[0..2],
        hash
    );

    let response = Client::builder()
        .build()
        .unwrap()
        .get(url)
        .send()
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
        .bytes()
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let mut header = HeaderMap::new();
    header.insert("Content-Type", HeaderValue::from_static("image/png"));

    Ok((StatusCode::OK, header, response))
}

#[derive(FromRow)]
pub struct User {
    pub login: String,
    #[sqlx(rename = "skinHash")]
    pub skin_hash: Option<String>,
    #[sqlx(rename = "capeHash")]
    pub cape_hash: Option<String>,
}

pub async fn get_hash(username: &str) -> Result<Option<User>, Box<(dyn std::error::Error)>> {
    let config = get_config();
    let pool = sqlx::mysql::MySqlPool::connect(&config.database_url).await?;
    let data =
        sqlx::query_as::<_, User>("SELECT login, skinHash, capeHash FROM User WHERE login = ?")
            .bind(username)
            .fetch_optional(&pool)
            .await?;

    Ok(data)
}
