<template>
  <v-App>
    <v-content>
      <AppNavbar></AppNavbar>
      <RoverView></RoverView>
    </v-content>
  </v-App>
  
</template>

<script>

  import AppNavbar from '@/components/AppNavbar.vue';
  import RoverView from '@/components/RoverView.vue';

  export default {
    data() {
      return {
        gridSize: '',
        step: 0,
        currRover: 0,
        grid: [],
        rovers: [
          { position: '', instructions: '', x: 0, y: 0, heading: '' },
          { position: '', instructions: '', x: 0, y: 0, heading: '' },
        ],
      };
    },
    components: { AppNavbar, RoverView }
    
  }
</script>


