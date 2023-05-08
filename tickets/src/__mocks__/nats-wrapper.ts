export const natsWrapper = {
  client: {
    publish: jest
      .fn()
      .mockImplementation((subject: any, data: any, callback: () => void) =>
        callback()
      )
  }
};
