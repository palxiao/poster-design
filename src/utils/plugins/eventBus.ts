import mitt from 'mitt';

type Events = {
  refreshUserImages: any;
};

const emitter = mitt<Events>();

export default emitter;