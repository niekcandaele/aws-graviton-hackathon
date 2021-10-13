use mongodb;
use rusoto_core::{credential, HttpClient, Region, RusotoError};
use rusoto_s3::{DeleteObjectError, DeleteObjectRequest, S3Client, S3};
use rusoto_sqs::{Message, ReceiveMessageError, ReceiveMessageRequest, Sqs, SqsClient};

pub struct Dispatcher {
    sqs: SqsClient,
    s3: S3Client,
    //mongodb: mongodb::Client,
    queue_url: String,
    bucket_url: String,
}

enum DispatcherError {
    MongodbError(mongodb::error::ErrorKind),
    RusotoError(RusotoError<String>),
}
pub type DispatcherResult<T> = Result<T, DispatcherError>;

impl From<mongodb::error::ErrorKind> for DispatcherError {
    fn from(e: mongodb::error::ErrorKind) -> Self {
        DispatcherError::MongodbError(e)
    }
}
impl From<RusotoError<String>> for DispatcherError {
    fn from(e: RusotoError<String>) -> Self {
        DispatcherError::RusotoError(e)
    }
}

impl Dispatcher {
    pub async fn new(queue_name: &str, bucket_url: &str) -> DispatcherResult<Self> {
        let sqs_dispatcher = HttpClient::new().expect("Failed to request an sqs dispatcher.");
        let creds = credential::EnvironmentProvider::with_prefix("HACKATHON");
        let sqs = SqsClient::new_with(sqs_dispatcher, creds.clone(), Region::EuWest1);

        // TODO: Not completely sure if I have to create this twice.
        let s3_dispatcher = HttpClient::new().expect("Failed to request an s3 dispatcher.");
        let s3 = S3Client::new_with(s3_dispatcher, creds.clone(), Region::EuWest1);

        let queue_url = get_queue_url(&sqs, queue_name.to_string()).await?;

        Ok(Self {
            s3,
            sqs,
            //mongodb: get_mongodb_client().await?,
            queue_url,
            bucket_url: bucket_url.to_string(),
        })
    }

    pub async fn delete_demo_entry(self, key: &str) -> Result<(), RusotoError<DeleteObjectError>> {
        let delete_object_req = DeleteObjectRequest {
            bucket: self.bucket_url.to_string(),
            key: key.to_string(),
            ..Default::default()
        };
        self.s3.delete_object(delete_object_req).await?;
        Ok(())
    }

    pub async fn get_message_from_queue(
        self,
    ) -> Result<Option<Message>, RusotoError<ReceiveMessageError>> {
        let receive_message_req = ReceiveMessageRequest {
            max_number_of_messages: Some(1),
            queue_url: self.queue_url,
            message_attribute_names: Some(vec![String::from("All")]),
            visibility_timeout: Some(20),
            wait_time_seconds: Some(20),
            ..Default::default()
        };
        let receive_message_result = self.sqs.receive_message(receive_message_req).await?;

        match receive_message_result.messages {
            None => return Ok(None),
            Some(messages) => {
                if messages.len() == 1 {
                    return Ok(Some(messages.get(0).unwrap().clone()));
                } else {
                    return Ok(None);
                }
            }
        }
    }
}

async fn get_queue_url(sqs: &SqsClient, queue_name: String) -> DispatcherResult<String> {
    todo!();
    /*
    let queue_url_opt = sqs
        .get_queue_url(GetQueueUrlRequest {
            queue_name: queue_name.to_string(),
            ..Default::default()
        })
        .await?
        .queue_url;
    */
}

async fn get_mongodb_client() -> Result<mongodb::Client, mongodb::error::Error> {
    // let mongodb_connection_uri = env!("HACKATHON_MONGODB_CONNECTION_URI");
    let mongodb_connection_uri = "123"; // temp
    let client_options = mongodb::options::ClientOptions::parse(mongodb_connection_uri).await?;
    mongodb::Client::with_options(client_options)
}
