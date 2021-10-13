#[macro_use]
extern crate log;

pub mod csgoprot;
pub mod dispatcher;
pub mod parser;

// use dispatcher::Dispatcher;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    const QUEUE_NAME: &str = "CdkStack-demoqueue674D5754-14ELD100UO0YE";
    const BUCKET_URL: &str = "cdkstack-gravitonhackathondemos280c5b93-ahk6xcrnq0yo";
    // let _dispatcher = Dispatcher::new(QUEUE_NAME, BUCKET_URL).await?;

    Ok(())
}
