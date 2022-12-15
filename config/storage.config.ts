
export const  StorageConfiguraion = {     
    photo: { 
        destination: '../storage/photos/',
        maxSize: 1024 * 1024 * 2,
        resize: {
            small: {
                widht: 320,
                height: 240,
                path: '../storage/photos/small'
            },
            thumb: { 
                widht: 120,
                height: 100,
                path: '../storage/photos/thumb'
            }
        }
    }
}
