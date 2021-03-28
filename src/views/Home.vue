<template>
  <ion-page>
    <ion-header class="header" :translucent="true">
      <ion-toolbar>
        <ion-title>Blank</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Blank</ion-title>
        </ion-toolbar>
      </ion-header>
    
      <div id="container">
          <Suspense>
            <template #default>
              <PhotoViewer />
            </template>
            <template #feedback>
              <div> Loading ... </div>
            </template>
          </Suspense>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { defineComponent, onMounted } from 'vue';
import PhotoViewer from '@/components/PhotoViewer.vue';

export default defineComponent({
  name: 'Home',
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    PhotoViewer,
  },
  setup() {
    onMounted( () => {
      const header = document.querySelector('.header');
      header?.classList.add('hidden');
    });
    return
  }
});
</script>

<style scoped>

ion-header {
  visibility: visible;
}
.hidden {
  visibility: hidden;
}
#container {
  
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  
  color: #8c8c8c;
  
  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>