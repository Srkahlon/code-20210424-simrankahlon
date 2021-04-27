def STACK_EXISTS = "false"
def STACK_NAME = "bmi-ecs-stack"
def ECR_REPO_NAME = "bmi-backend"
def TASK_NAME = "bmi-backend-task" 
def ECS_SERVICE = "bmi-backend-service"
def CONTAINER_NAME = "bmi-backend-container"
def CONTAINER_PORT = 8080
def CONTAINER_CPU = 256
def CONTAINER_MEMORY = 512
def CLUSTER_NAME = "bmi-backend-cluster"
def DESIRED_COUNT = 1
def SECURITY_GROUP = 'sg-08ab5079ccecb9909'
def SUBNET1 = "subnet-82cf59c9"
def SUBNET2 = "subnet-c0badea4"
def PRIORITY = 1
def PATH = "*"
def VPCID = "vpc-2293055b"
def REST_API = "bmi-backend-api"
def METHOD_ROUTE = "/bmi.api/v1/repositoryDetails"
def TEMPLATE_LOCATION = "file://cloudformation_template.yml"

pipeline {
    agent any
    environment {
        //Add the account id of the AWS Account from "Manage credentials" in Jenkins
        ACCOUNT_ID = credentials('account_id')
        REGION = "us-east-1"
    }
    stages {
        //Stage that checks if the stack already exists in AWS
        stage('Check if stack exists') {
            steps {
                script
                {
                    try
                    {
                        //Describe-stacks will return the status of the stack if its found, else it will throw exception.
                        instanceInfo = sh (
                                script: "aws cloudformation describe-stacks --stack-name  ${STACK_NAME} --region '${REGION}' --query 'Stacks[0].StackStatus' --output text",
                                returnStdout: true
                        ).trim()
                        STACK_EXISTS = "true"
                    }
                    catch(Exception e)
                    {
                        echo "Stack does not exist in AWS."
                    }
                }
            }
        }
        //This step checks the value of "STACK_EXISTS" variable and accordingly decides whether stack needs to be created or not.
        stage('Create Stack') {
            steps {
                script
                {
                    //Stack not found, so create stack.
                    if(STACK_EXISTS == "false")
                    {
                        sh "aws cloudformation create-stack --stack-name ${STACK_NAME} --template-body ${TEMPLATE_LOCATION} --region '${REGION}' --parameters  ParameterKey=RepositoryName,ParameterValue=${ECR_REPO_NAME} ParameterKey=TaskName,ParameterValue=${TASK_NAME} ParameterKey=ServiceName,ParameterValue=${ECS_SERVICE} ParameterKey=ContainerName,ParameterValue=${CONTAINER_NAME} ParameterKey=ContainerPort,ParameterValue=${CONTAINER_PORT} ParameterKey=ContainerCpu,ParameterValue=${CONTAINER_CPU} ParameterKey=ContainerMemory,ParameterValue=${CONTAINER_MEMORY} ParameterKey=ClusterName,ParameterValue=${CLUSTER_NAME} ParameterKey=SecurityGroup,ParameterValue=${SECURITY_GROUP} ParameterKey=Subnet1,ParameterValue=${SUBNET1} ParameterKey=Subnet2,ParameterValue=${SUBNET2} ParameterKey=Priority,ParameterValue=${PRIORITY} ParameterKey=Path,ParameterValue=${PATH} ParameterKey=VPCID,ParameterValue=${VPCID} ParameterKey=RestAPI,ParameterValue=${REST_API} ParameterKey=MethodRoute,ParameterValue=${METHOD_ROUTE} ParameterKey=ImageURL,ParameterValue='${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${ECR_REPO_NAME}' --capabilities CAPABILITY_NAMED_IAM"
                        //Introducted a delay of 4 minutes for the stack to get created and then build and push the docker image.
                        sleep time: 240000, unit: 'MILLISECONDS'
                    }
                    else
                    {
                        echo "stack already exists, not need to create one."
                    }
                }
            }
        }
        //Run Tests
        stage('Test') {
            steps {
                script {
                    //Install the node modules
                    sh "npm install"
                    //Run the tests
                    sh "npm test"
                }
            }
        }
        //Build and Push Docker Image
        stage('Build & Push Image') {
            steps {
                script {
                    //AWS Credentials(Access and Secret) stored as "aws_creds" in Manage Credentials in Jenkins 
                    docker.withRegistry(
                        "https://${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${ECR_REPO_NAME}",
                        "ecr:${REGION}:aws_creds"
                    )
                    {
                        def myImage = docker.build("${ECR_REPO_NAME}")
                        myImage.push("latest")
                    }
                    //Force a new deployment for the service
                    sh "aws ecs update-service --service ${ECS_SERVICE} --cluster ${CLUSTER_NAME} --desired-count ${DESIRED_COUNT} --force-new-deployment --region '${REGION}'"
                }
            }
        }
    }
}