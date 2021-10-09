import os
import boto3
from dotenv import load_dotenv

load_dotenv()
#dynamodb = boto3.resource('dynamodb', endpoint_url='http://localhost:8000')
dynamodb = boto3.resource('dynamodb', region_name="eu-west-1")

table = dynamodb.Table('Stats')

def getItem(itemName):
    response = table.get_item(
        Key={
            'id': itemName
        }
    )
    return response['Item']


def putItem(itemName, item):
    table.put_item(
        Item={
            'id': itemName,
            'data': item
        }
    )

def scan():
    response = table.scan()
    return response['Items']

def create_table():
    table = dynamodb.create_table(
        TableName='Stats',
        KeySchema=[
            {
                'AttributeName': 'id',
                'KeyType': 'HASH'  # Partition key
            },
        ],
        AttributeDefinitions=[
            {
                'AttributeName': 'id',
                'AttributeType': 'S'
            },
        ],
        ProvisionedThroughput={
            # ReadCapacityUnits set to 10 strongly consistent reads per second
            'ReadCapacityUnits': 10,
            'WriteCapacityUnits': 10  # WriteCapacityUnits set to 10 writes per second
        }
    )

    return table    