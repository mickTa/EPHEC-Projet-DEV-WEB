export default ({ config }) => {
  return {
    ...config,
    extra: {
      ...config.expo?.extra,
      LOCALHOST_API: process.env.LOCALHOST_API,
      LAN_API: process.env.LAN_API,
      eas: {
        projectId: "51d82368-9ada-4f6d-8d18-e9eecbd3f93e",
      },
    },
  };
};
