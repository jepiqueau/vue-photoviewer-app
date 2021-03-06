
<template>
    <div id="photoviewer-container">

    </div>
</template>
<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { PhotoViewer, Image, ViewerOptions, 
         capEchoOptions, capEchoResult,
         capShowOptions, capShowResult} from '@capacitor-community/photoviewer';
import { Toast } from '@capacitor/toast';
import { base64List } from '@/utils/base64Images';
export default defineComponent({
    name: 'PhotoViewer',
    async setup() {
        const echo = async (value: string): Promise<capEchoResult> => {
            const val: any = {};
            val.value = value;
            const ret = await PhotoViewer.echo(val);
            return ret;
        }
        const imageList: Image[] = [
            {url: "https://i.ibb.co/wBYDxLq/beach.jpg", title: "Beach Houses"},
            {url: "https://i.ibb.co/gM5NNJX/butterfly.jpg", title: "Butterfly"},
            {url: "https://i.ibb.co/10fFGkZ/car-race.jpg", title: "Car Racing"},
            {url: "https://i.ibb.co/ygqHsHV/coffee-milk.jpg", title: "Coffee with Milk"},
            {url: "https://i.ibb.co/7XqwsLw/fox.jpg", title: "Fox"},
            {url: "https://i.ibb.co/L1m1NxP/girl.jpg", title: "Mountain Girl"},
            {url: "https://i.ibb.co/wc9rSgw/desserts.jpg", title: "Desserts Table"},
            {url: "https://i.picsum.photos/id/1009/5000/7502.jpg?hmac=Uj6crVILzsKbyZreBjHuMiaq_-n30qoHjqP0i7r30r8", title: "Surfer"},
            {url: "https://i.picsum.photos/id/1011/5472/3648.jpg?hmac=Koo9845x2akkVzVFX3xxAc9BCkeGYA9VRVfLE4f0Zzk", title: "On a Lac"},
            {url: "https://i.ibb.co/wdrdpKC/kitten.jpg", title: "Kitten"},
            {url: "https://i.ibb.co/dBCHzXQ/paris.jpg", title: "Paris Eiffel"},
            {url: "https://i.ibb.co/JKB0KPk/pizza.jpg", title: "Pizza Time"},
            {url: "https://i.ibb.co/VYYPZGk/salmon.jpg", title: "Salmon "},
        ]


        const options: ViewerOptions = {} as ViewerOptions;
        
        const show = async (imageList: Image[], options?: ViewerOptions): Promise<capShowResult> => {
            const opt: capShowOptions = {} as capShowOptions;
            opt.images = imageList;
            if(options) opt.options = options
            try {
                const ret = await PhotoViewer.show(opt);
                if(ret.result) {
                    return Promise.resolve(ret);
                } else {
                    return Promise.reject(ret);
                }
            } catch (err) {
                const ret: capShowResult = {} as capShowResult;
                ret.result = false;
                ret.message = err.message;
                return Promise.reject(ret);
            }

        }

        const showToast = async (message: string) => {
            await Toast.show({
                text: message,
                position: 'center',
            });
        };

        onMounted(async () => {
            let ret: any = await echo("Hello from jeepq");
            if(!ret.value) {
                await showToast("no value to echo")
            }
            try {
                // **************************************
                // here you defined the different options
                // **************************************

                // uncomment the following desired lines below
                // options.title = false;
                // options.share = false;
                // options.transformer = "depth";
                // options.spancount = 2
                options.maxzoomscale = 3
                options.compressionquality = 0.6

                // **************************************
                // here you defined url or Base64 images
                // **************************************

                // comment or uncomment as you wish

                // http images call
                ret = await show(imageList, options);

                // base64 images call
                //ret = await show(base64List, options);

                if(!ret.result) {
                    await showToast(JSON.stringify(ret));
                }

            } catch (err) {
                await showToast(err.message);
            }
        });
        return
    }
});
</script>