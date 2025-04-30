import React from "react";
import { Platform } from "react-native";

let CameraComponent: React.ComponentType<any> = () => null;

if (Platform.OS !== "web") {
  const { Camera } = require("react-native-vision-camera");
  CameraComponent = Camera;
}

export default CameraComponent;
