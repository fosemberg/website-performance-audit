globIter = 0;
mixConfig = (tags, poses, posesMax = [...poses], isShift = false, cur = 0) => {
  if (!isShift) {
    console.log(globIter, poses);
    globIter++; // delete
  }
  //console.log(globIter, posesMax);
  if (poses[cur] !== 0) {
    poses[cur] -= 1;
    if (isShift) {
      for (let i = 0; i < cur; i++) {
        poses[i] = posesMax[i];
      }
      mixConfig(tags, poses, posesMax, false, 0);
      //console.log('mixConfig(tags, poses, posesMax, false, 0);')
    } else {
      mixConfig(tags, poses, posesMax, false, cur);
    }
  } else {
    // console.log("!poses.join('').replace(/0/g,'')", !poses.join('').replace(/0/g,''));
    if (poses.join('').replace(/0/g,'') && globIter < 100) {
      //console.log('mixConfig(tags, poses, posesMax, true, cur + 1);');
      mixConfig(tags, poses, posesMax, true, cur + 1);
    }
  }
}

mixConfig({}, [1,2])
