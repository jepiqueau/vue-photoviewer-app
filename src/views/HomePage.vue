<template>
  <ion-page>
    <ion-header class="header" :translucent="true">
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Home</ion-title>
        </ion-toolbar>
      </ion-header> 
      <ion-card>
        <ion-card-header>
          <ion-card-title>Test Modes</ion-card-title>
        </ion-card-header>
        <ion-card-content>
        <div>
          <ion-item color="primary">
            <ion-label id="mCheckBox-label">{{mCheckBox.val}}</ion-label>
            <ion-checkbox
              slot="start"
              mode="ios"
              color="dark"
              @update:modelValue="handleCheckbox($event)"
              :modelValue="mCheckBox.isChecked">
            </ion-checkbox>          
          </ion-item>
          <ion-item class="capitalize" v-for="button in mButtons" :key="button.id" 
              color="primary" button="true" @click="handleClickMode(button.mode)">
            {{button.mode}}
          </ion-item>
          <ion-item color="light">
            <ion-input class="midlength" clear-input type="number" placeholder="Enter startFrom"
              :modelValue="inputValue" @update:modelValue="handleInputChange($event)"></ion-input>
              <ion-button class="midlength" @click="handleButtonClick()" >Valid</ion-button>
          </ion-item>
        </div>
        <div class="output-div" v-if="imageIndex!=-1">
          <p>Last selected image: {{imageIndex}}</p>
        </div>
        <div class="output-div" v-if="message.length>0">
          <p>Error: {{message}}</p>
        </div>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
         IonItem, IonLabel, IonCheckbox, IonInput, IonCard, IonCardTitle,
         IonCardHeader, IonCardContent, IonButton} from '@ionic/vue';
import { defineComponent, onMounted } from 'vue';
import ApiService from '../services/api.services';
import { useState } from '@/composables/state';
import { base64List } from '@/utils/base64Images';
import router from '../router';
import { useEmitter} from '../composables/emitter';
import { Toast } from '@capacitor/toast';


export default defineComponent({
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonCheckbox,
    IonInput,
    IonButton
  },
  setup() {
    const apiService = new ApiService();
    const emitter = useEmitter();
    const [imageList, setImageList] = useState([]);
    const [options, setOptions] = useState({});
    const [mode, setMode] = useState("");
    const [startFrom, setStartFrom] = useState(0);
    const [base64, setBase64] = useState(false);
    const mCheckBox = {val: 'Images Base64', isChecked: false };
    const [imageIndex, setImageIndex] = useState(-1);
    const [message, setMessage] = useState("");
    const [inputValue, setInputValue] = useState("");
    const mButtons = [
      {id: 1, mode: "one"},
      {id: 2, mode: "gallery"},
      {id: 1, mode: "slider"}
    ]
    const setOutput = async (event: any) => {
      if (event.detail.result) {
        if(event.detail.imageIndex) setImageIndex(event.detail.imageIndex);
      }
      if (event.detail.message) {
        await showToast(event.detail.message);
        setMessage(event.detail.message)
      }
    }
    const resetOuput = () => {
      setImageIndex(-1);
      setMessage("");
    }
    const handleCheckbox = async (event: boolean) => {
      setBase64(event);
      await getImages();
    }
    const handleClickMode = async (sMode:string) => {
      setMode(sMode);
      if(sMode === "gallery") {
        setInputValue("");
        setStartFrom(0);
      }
      resetOuput();
      const props: any = {
        imageList: JSON.stringify(imageList._value),
        mode: mode._value,
        startFrom: startFrom._value,
        options: JSON.stringify(options._value)
      }
      router.push({ name: 'Viewer', params: props})
    }
    const handleInputChange = (event:number) => {
      setInputValue(event.toString());
    }
    const handleButtonClick = () => {
      setStartFrom(Number(inputValue._value));
    }

    const getImages = async () => {
      if(base64._value) {
        setImageList(base64List);
      } else {
        setImageList(await apiService.getImages());
      }
    }
    setOptions({
      // uncomment the following desired lines below
      // title: false,
      // share: false,
      // transformer: "depth",
      // spancount: 2,
      maxzoomscale: 3,
      compressionquality: 0.6,
      movieoptions:{mode: "portrait", imagetime: 3}

    });
    const showToast = async (message: string) => {
        await Toast.show({
            text: message,
            duration: "long",
            position: 'bottom',
        });
    };

    onMounted( async () => {
      emitter.on('onExit',(e: any) => setOutput(e));
      const header = document.querySelector('.header');
      header?.classList.add('hidden');
      await getImages();

    });

    return {mCheckBox, inputValue, mButtons, handleCheckbox,
            handleClickMode, handleInputChange, handleButtonClick,
            imageIndex, message }
  }
});
</script>

<style scoped>

ion-header {
  visibility: visible;
}
ion-item {
  font-size: 25px;
}
.capitalize {
    text-transform: capitalize;
}
.midlength {
  width: 50%;
}
.hidden {
  visibility: hidden;
}

.output-div {
  font-size: 25px;
  line-height: 30px;
}
ion-card-title {
  font-size: 30px;
}
ion-card-content p {
  font-size: 25px;
}
</style>
