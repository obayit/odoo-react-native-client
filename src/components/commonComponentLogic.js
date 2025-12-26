// this file contains common component logic that is specific to the ui library (e.g: UI Kitten)

export function getMarginFromStyle(style){
  // here we only are looking for the margin value of the original input, so that the error message will align with that input
  let errorMarginHorizontal = 10;
  if(style instanceof Array){
    for(let i=0; i<style.length; i++){
      const currStyle = style[i];
      if(currStyle){
        errorMarginHorizontal = currStyle.marginHorizontal ? currStyle.marginHorizontal : currStyle.marginLeft;
      }
    }
  }else if(style){
    errorMarginHorizontal = style.marginHorizontal ? style.marginHorizontal : style.marginLeft;
  }
  return {
    marginHorizontal: errorMarginHorizontal ? errorMarginHorizontal : 10,
  }
}

export const shortenFilename = (filename, max_length = 20) => {
  let res = filename;
  try{
    if(filename.length > max_length){
      let extensionPos = filename.lastIndexOf('.')
      let extension = '';
      if(extensionPos !== -1){
        extension = filename.slice(extensionPos)
      }
      res = filename.slice(0, max_length - 6) + '.. ';
      if(extension.length <= 4){
        res += extension;
      }
    }
  }catch{}
  return res;
}

export const getShortenedNames = (names) => {
  let res = names;
  if(!names){
    return names;
  }
  const namesArray = names.split(',');
  res = [];
  try{
    namesArray.map((item) => res.push(shortenFilename(item)));
  }catch{
    return names;
  }
  return res.toString();
}

export const onlyImageFiles = (remoteFile) => {
  return remoteFile && remoteFile.mimetype && remoteFile.mimetype.includes('image');
}
