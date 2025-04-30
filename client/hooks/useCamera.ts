import { Platform } from "react-native";

export let useCameraDevices: any = () => ({ back: null });
export let useFrameProcessor: any = () => undefined;
export let useScanBarcodes: any = () => [
  (frame: any) => {
    "worklet";
    return [];
  },
  [],
];

if (Platform.OS !== "web") {
  const vision = require("react-native-vision-camera");
  useCameraDevices = vision.useCameraDevices;
  useFrameProcessor = vision.useFrameProcessor;

  // Simulation d’un scan désactivé, mais worklet-compatible
  useScanBarcodes = () => [
    (frame: any) => {
      "worklet";
      return [];
    },
    [],
  ];
}
