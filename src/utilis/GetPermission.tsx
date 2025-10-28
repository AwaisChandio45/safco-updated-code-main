import React from 'react'
import { Platform, PermissionsAndroid  } from 'react-native'

export const getPermission =async ()=>{
    
    if (Platform.OS == 'android') {
       const granted_ACCESS_FINE_LOCATION = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        const promise = new Promise(async(resolve, reject)=>{
           
            if (granted_ACCESS_FINE_LOCATION) {
                
                console.log('====>Location permision success')
                const cameraPermission = await PermissionsAndroid.check(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                )
                
                if(cameraPermission){
                    console.log('camera permission success')
                    const writeStoragePermission = await PermissionsAndroid.check(
                        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    )
     
                    if(writeStoragePermission){
                        console.log('write storage permission success')
                        const readStoragePermission = await PermissionsAndroid.check(
                            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                        )
                        if(readStoragePermission){
                          
                            console.log('read storage permission success')
                            resolve(true)  
                        
                        }else{
                            
                            console.log('read storage permission failed')
                            reject(false)
                        }
                    }else{
                        
                        console.log('write storage permission failed')
                        reject(false)
                    }
                    
                }else{
                    
                    console.log('camera permission failed')
                    reject(false)
                
                }
            } else {
                console.log('=====>Location permission failed')
                 reject(false)
            }
        })

        return promise
    }
}