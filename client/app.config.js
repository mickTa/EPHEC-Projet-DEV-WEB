export default ({ config }) => {
  return {
    ...config,
    extra: {
      LOCALHOST_API: process.env.LOCALHOST_API,
      LAN_API: process.env.LAN_API,
    },
  };
};
