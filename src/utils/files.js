import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import { addLocalFileAction } from '../common/store/redux';

const basePath = `${FileSystem.documentDirectory}user-files`;

export const useLocalFiles = () => {
  const dispatch = useDispatch();
  const saveFromBase64Async = async (remoteFile, data64) => {
    if(Platform.OS === 'web'){
      return;
    }
    // make directory if it does not exist
    await FileSystem.makeDirectoryAsync(basePath, { intermediates: true });
    const path = `${basePath}/${remoteFile.id}`
    await FileSystem.writeAsStringAsync(path, data64, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    const newLocalFile = {
      ...remoteFile,
      path,
    };
    dispatch(addLocalFileAction(newLocalFile));
  }
  const removeOldFiles = async (remoteFiles) => {
    let filenameList = [];
    if(Platform.OS === 'web'){
      return;
    }
    try{
      filenameList = await FileSystem.readDirectoryAsync(basePath);  // this might throw if the directory does not exist
      filenameList.map((file) => {
        let fileExists = false;
        for(let i=0; i<remoteFiles.length; i++){
          if(remoteFiles[i].id === Number(file)){
            fileExists = true;
            break;
          }
        }
        if(!fileExists){
          FileSystem.deleteAsync(`${basePath}/${file}`);
        }
      });
    }catch{}
  }
  return {
    saveFromBase64Async,
    removeOldFiles,
  }
}
