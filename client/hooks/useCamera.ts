import { Platform } from "react-native";

// Définition par défaut pour le Web
export let useCameraDevices: any = () => ({ back: null });
export let useFrameProcessor: any = () => undefined;
export let useScanBarcodes: any = () => [
  (frame: any) => {
    "worklet"; // Cette ligne marque la fonction comme worklet
    return [];
  },
  [],
];

if (Platform.OS !== "web") {
  const vision = require("react-native-vision-camera");
  useCameraDevices = vision.useCameraDevices;
  useFrameProcessor = vision.useFrameProcessor;

  // Déclaration correcte de la fonction worklet
  useScanBarcodes = () => [
    (frame: any) => {
      "worklet"; // Cette ligne marque la fonction comme worklet
      return []; // Simulation d'un scan désactivé ou vide
    },
    [],
  ];
}
