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

export const bucketName = bucket.id;
export const bucketEndpoint = pulumi.interpolate`http://${bucket.websiteEndpoint}`;
