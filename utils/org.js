const ora = () => {
  // Node在终端上的输出流stdout、stderr,分别由 console.log() 和 console.error() 内部使用
  // https://nodejs.cn/api/process.html#a-note-on-process-io
  const stream = process.stdout;
  // const stream = process.stderr;
  const spinner = {
    interval: 80,
    frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
  };
  let curIndex = 0;
  setInterval(() => {
    // 取余保证是取0-9的数
    const frame = spinner.frames[curIndex++ % spinner.frames.length];
    // 每次移到0的位置
    stream.cursorTo(0);
    stream.write(frame + " loading");
  }, spinner.interval);
};

ora();
