import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useAPIError from "../common/hooks/useAPIError";
import { actions } from "../common/providers/APIErrorProvider";
import config from "../native-common/config";

function compare(newRemoteVersion){
    let newRequired = false;  // new version uses the version read by the operating system
    try{
        newRequired = compareVersion(newRemoteVersion);
    }catch{}

    return newRequired;
}

function compareVersion(remoteVersion){
    // this should be used instead of the old version,
    // the work on the new version is still in progress
    const version = config.version;
    let minParts = remoteVersion.split('.');
    let versionParts = version.split('.');
    let comparisonParts = [];
    let result = undefined;

    if(minParts.length == versionParts.length){
        for(let i=0; i<versionParts.length; i++){
            let numberMin = Number(minParts[i]);
            let numberVersion = Number(versionParts[i]);
            if(numberMin === numberVersion){
                comparisonParts.push(0);
            }else{
                comparisonParts.push(numberMin < numberVersion);
            }
        }
        for(let i=0; i<comparisonParts.length; i++){
            if(comparisonParts[i] === 0){
                result = false;
                continue;
            }
            result = !comparisonParts[i];
            break;
        }
    }
    return result;
}

function getUpdateAvailable(currentBuildNumber){
    return compare(currentBuildNumber);
}

function getUpdateRequired(currentBuildNumber){
    return compare(currentBuildNumber);
}

export default (disablePull) => {
  const version = '0.0.0';  // TODO: read version from redux store
  const { addError } = useAPIError();
  const dispatch = useDispatch();
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateRequired, setUpdateRequired] = useState(false);
  const refreshData = async () => {
    if(!disablePull){
        // await fetchNewVersion({addError, dispatch});
    }
    setUpdateRequired(getUpdateRequired(version));
    setUpdateAvailable(getUpdateAvailable(version));
  }
  useEffect(() => {
    refreshData();
  }, [])
  useEffect(() => {
    if(updateRequired){
        addError('This version is outdated, please update the app.', actions.updateRequired);
    }
  }, [updateRequired])
  return {
        updateAvailable,
        updateRequired,
  }
}
