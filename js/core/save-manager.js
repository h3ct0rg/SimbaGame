const KEY = 'simba-save-v1';

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch (e) {
    return {};
  }
}

function write(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch (e) {
    /* storage unavailable, ignore */
  }
}

export const SaveManager = {
  getCheckpoint() {
    return read().checkpoint || null;
  },

  setCheckpoint(stateName) {
    const data = read();
    data.checkpoint = stateName;
    write(data);
  },

  clearCheckpoint() {
    const data = read();
    delete data.checkpoint;
    write(data);
  },

  getMuted() {
    return !!read().muted;
  },

  setMuted(muted) {
    const data = read();
    data.muted = muted;
    write(data);
  },
};
