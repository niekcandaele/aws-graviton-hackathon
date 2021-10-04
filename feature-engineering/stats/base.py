import boto3

def create_table():
    table = dynamodb.create_table(
        TableName='Stats',
        KeySchema=[
            {
                'AttributeName': 'stats_id',
                'KeyType': 'HASH'  # Partition key
            },
            {
                'AttributeName': 'stats_secondary',
                'KeyType': 'RANGE'  # Sort key
            }
        ],
        AttributeDefinitions=[
            {
                'AttributeName': 'stats_id',
                # AttributeType defines the data type. 'S' is string type and 'N' is number type
                'AttributeType': 'S'
            },
            {
                'AttributeName': 'stats_secondary',
                'AttributeType': 'N'
            },
        ],
        ProvisionedThroughput={
            # ReadCapacityUnits set to 10 strongly consistent reads per second
            'ReadCapacityUnits': 10,
            'WriteCapacityUnits': 10  # WriteCapacityUnits set to 10 writes per second
        }
    )

    return table

if __name__ == '__main__':
    dynamodb = boto3.client('dynamodb', endpoint_url='http://localhost:8000')

    response = dynamodb.describe_table(TableName='Stats')
    print(response)