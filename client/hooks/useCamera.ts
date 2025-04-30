import { Platform } from "react-native";

// Remplacer les hooks par des mocks vides pour ne pas planter
export let useCameraDevices: any = () => ({ back: null });
export let useFrameProcessor: any = () => undefined;
export let useScanBarcodes: any = () => [() => {}, []];

if (Platform.OS !== "web") {
  const vision = require("react-native-vision-camera");

  useCameraDevices = vision.useCameraDevices;
  useFrameProcessor = vision.useFrameProcessor;

  // Scanner désactivé temporairement
  useScanBarcodes = () => [() => {}, []];
}
