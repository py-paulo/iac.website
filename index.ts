import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

const bucket = new aws.s3.Bucket("website");

const bucketObject = new aws.s3.BucketObject("index.html", {
  acl: "public-read",
  contentType: "text/html",
  bucket: bucket,
  source: new pulumi.asset.FileAsset("./htdocs/index.html")
});

const lambdaRole = new aws.iam.Role("lambdaRole", {
  assumeRolePolicy: {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "sts:AssumeRole",
        Principal: {
          Service: "lambda.amazonaws.com",
        },
        Effect: "Allow",
        Sid: "",
      },
    ],
  },
});

const lambdaRoleAttachment = new aws.iam.RolePolicyAttachment("lambdaRoleAttachment", {
  role: lambdaRole,
  policyArn: aws.iam.ManagedPolicy.AWSLambdaBasicExecutionRole,
});

const lambda = new aws.lambda.Function("lambdaFunction", {
  code: new pulumi.asset.AssetArchive({
    ".": new pulumi.asset.FileArchive("./app"),
  }),
  runtime: "nodejs14.x",
  role: lambdaRole.arn,
  handler: "index.handler",
});

export const bucketName = bucket.id;
export const bucketEndpoint = pulumi.interpolate`http://${bucket.websiteEndpoint}`;
