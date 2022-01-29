<template>
  <ion-page>
    <ion-header class="viewer-header" :translucent="true">
      <ion-toolbar>
        <ion-title>Viewer</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content :fullscreen="true">
      <ion-header class="viewer-header" collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Viewer</ion-title>
        </ion-toolbar>
      </ion-header>
      <div id="container">
        <div id="photoviewer-container">
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>
<script lang="ts">
import { defineComponent, onMounted, onUnmounted } from 'vue';
import { useIonRouter } from '@ionic/vue';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from '@ionic/vue';
import { PhotoViewer, Image, ViewerOptions, capEchoResult, capShowResult, capShowOptions} from '@capacitor-community/photoviewer';
import { useEmitter} from '../composables/emitter';

export default defineComponent({
  name: "ViewerPage",
  props: ["imageList","mode","startFrom","options"],
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar
  },
  setup(props) {
    const ionRouter = useIonRouter();
    const emitter = useEmitter();
    let listenerExit: any
    const pvPlugin:any = PhotoViewer;
    const addListener = async () => {
        listenerExit = await pvPlugin.addListener('jeepCapPhotoViewerExit',
            (e: any) => {
            const data: any = {};
            data.result = e.result;
            data.imageIndex = e.imageIndex;
            data.message = e.message;
            emitter.emit('onExit', { detail: data });
            if (ionRouter.canGoBack()) {
                ionRouter.back();
            }
        });
    }

    const echo = async (value: string): Promise<capEchoResult> => {
        const val: any = {};
        val.value = value;
        const ret = await pvPlugin.echo(val);
        return ret;
    }
    const show = async (images: Image[], mode: string, startFrom: number,
                        options?: ViewerOptions): Promise<capShowResult> => {

        const opts: capShowOptions = {images: images, mode: mode, startFrom: startFrom};
        if (options != null && Object.keys(options).length != 0 ) {
            opts.options = options;
        }
        try {
            const ret = await pvPlugin.show(opts);
            return Promise.resolve(ret);
        } catch (err: any) {
            const ret: capShowResult = {} as capShowResult;
            ret.result = false;
            ret.message = err.message;
            return Promise.resolve(ret);
        }

    }

    onMounted( async () => {
      const header = document.querySelector('.viewer-header');
      header?.classList.add('hidden');
      let ret: any = await echo("Hello from jeepq");
      console.log(`>>> echo: ${JSON.stringify(ret)}`);
      await addListener();
      ret = await show(JSON.parse(props.imageList), props.mode,
                       Number(props.startFrom), JSON.parse(props.options));

    });
    onUnmounted(async() => {
        await listenerExit.remove();
    })

    return {props};
  }
});
</script>
<style scoped>
#container {
  
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.viewer-header {
  visibility: visible;
}
.hidden {
  visibility: hidden;
}
</style>
