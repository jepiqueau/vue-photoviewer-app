import imageList from '../../public/assets/json/imagelist.json';
import { Image } from '@capacitor-community/photoviewer';
import {Ref} from 'vue';

export default class ApiService {
    imageList: Image[] = imageList.imageList;
    public async get(contentId: Ref<string | string[]>): Promise<Image>{
        const index = Number(contentId.value);
        if(index <= this.imageList.length) {
            return Promise.resolve(this.imageList[index]);        
        } else {
            return Promise.resolve({} as Image);
        }
    }
    public async getImages(): Promise<Image[]> {
        if(this.imageList != null) {
            return Promise.resolve(this.imageList);
        } else {
            return Promise.resolve([]);
        }
    }
}