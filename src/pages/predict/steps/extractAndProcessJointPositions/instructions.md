1. Use the Mediapipe model to extract the set of joint positions from an image (in this case your webcam).

![mediapipe hands datapoints]({{baseUrl}}instructions/extract_joint_asset1.png)

2. Flatten the joint positions into an array of values with the format: 
`[x_1,y_1,z_1,x_2,y_2,z_2 ... x_21, y_21, z_21]`
3. Normalize the flattened joint positions so that their values are scaled from -1 to 1.