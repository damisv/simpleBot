import SteemController from './src/steem/steem';

const process = async () => {
  const steem = new SteemController();
  await steem.startProcess();
};

process();