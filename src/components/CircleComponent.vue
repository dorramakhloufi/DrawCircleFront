<template>
  <div id="app">
    <div mb-10>
      <form class="max-w-sm mx-auto ">
        <label for="xInput" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white " >X:</label>
        <input type="number" id="xInput" v-model.number="x" aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 " placeholder="X Coordinate" required />
        <label for="yInput" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Y:</label>
        <input type="number" id="yInput" v-model.number="y" aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Y Coordinate" required />
      </form>
    </div>
    <div>
      <button class="button" @click="submitCircle">Submit</button>
    </div>
    <canvas ref="canvas" width="1000" height="1000" style="border: 1px solid black;" @click="drawCircle" ></canvas>
  <div id="table-container" >
    <table id="customers" v-if="existingCircles.length > 0">
      <thead>
        <tr>
          <th>Diameter</th>
          <th>Color</th>
          <th>Set ID</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(circle, index) in existingCircles" :key="index">
          <td>{{ circle.diameter }}</td>
          <td>{{ circle.color }}</td>
          <td>{{ circle.setId }}</td>
        </tr>
      </tbody>
      
    </table>
  </div>
  </div>
</template>

<script>
import axios from 'axios';
import api from '@/Action/api';
//import { useRoute } from 'vue-router';

export default {
  data() {
    return {
      x: 0,
      y: 0,
      drawnCircles: [], 
      lastSubmission: { x: null, y: null }, 
      drawnCircle: {
        diameter: 0,
        color: '',
        setId: '',
        desiredSetId: ''
      },
      existingCircles: [], 
    }
  },
  

watch: {
  $route(to) {
    // Fetch circles when the route changes
    this.getCirclesBySetId(to.params.setId);
  },
},

beforeRouteEnter(to, from, next) {
  api.getCirclesBySetId(to.params.setId)
    .then(response => {
      const circles = response.data;
      next(vm => {
        // Access vm instead of this
        vm.existingCircles = circles;
        vm.drawApiCircles();
      });
    })
    .catch(error => {
      console.error('Error fetching circles:', error);
      next(); 
    });
},

beforeRouteUpdate(to,  next) {
this.getCirclesBySetId(to.params.setId);
next();
},

   async mounted() {

     //const route=useRoute();
     //console.log(route);
     const currentUrl = window.location.href;
     const parts = currentUrl.split('/');
     const value = parts[parts.length - 1];
        
     //Fetch circles based on route parameters when component is mounted
    await this.getCirclesBySetId(value);
    await this.getCirclesBySetId(value);
  
     this.drawApiCircles();
   },
  
  methods: {  

    drawApiCircles() {
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext('2d');
      const canvasHeight = canvas.height;

      // Draw circles retrieved from the API
      this.existingCircles.forEach(circle => {
      // Calculate the coordinates for each circle
      const apiCircleX = circle.x;
      const apiCircleY = canvasHeight - circle.y; // Invert Y coordinate
      const apiCircleDiameter = circle.diameter;
      const apiCircleColor = circle.color;

      // Draw the circle
      ctx.beginPath();
      ctx.arc(apiCircleX, apiCircleY, apiCircleDiameter / 2, 0, Math.PI * 2);
      ctx.fillStyle = apiCircleColor;
      ctx.fill();
      ctx.closePath();

      });
    },async loadCircles(setId) {
      try {
        await this.getCirclesBySetId(setId);
        this.drawApiCircles();
      } catch (error) {
        console.error('Error fetching circles:', error);
      }
    },

  drawCircle() {
  const canvas = this.$refs.canvas;
  const ctx = canvas.getContext('2d');
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  // Clear previous drawings
  //ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Draw X and Y axes 
  ctx.beginPath();
  ctx.moveTo(0, canvasHeight); 
  ctx.lineTo(canvasWidth, canvasHeight); 
  ctx.moveTo(0, canvasHeight); 
  ctx.lineTo(0, 0); 
  ctx.strokeStyle = 'black';
  ctx.stroke();

  // Check if there are already circles drawn on the canvas
  //const existingCircleIds = this.getCircleIds();

  // Generate random diameter 
  const diameter = Math.floor(Math.random() * canvasWidth);

  // Generate random color
  const color = '#' + Math.floor(Math.random()*16777215).toString(16);

  // Calculate circle center based on user-provided X and Y coordinates
  const centerX = this.x;
  const centerY = canvasHeight - this.y; 

  // Draw circle with center aligned to the provided X and Y coordinates
  ctx.beginPath();
  ctx.arc(centerX, centerY, diameter / 2, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();

  // Update drawn circle properties
  //const setId = existingCircleIds && this.existingCircles.length > 0 ? this.existingCircles[0].setId : this.generateSetId();
  //const setId = this.$route.params.setId;
  const currentUrl = window.location.href;
  const parts = currentUrl.split('/');
  const setId = parts[parts.length - 1];
  this.drawnCircle.diameter = diameter;
  this.drawnCircle.color = color;
  this.drawnCircle.setId = setId;
},

getCircleIds() {
  const canvas = this.$refs.canvas;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const existingCircleIds = [];

  // Loop through the pixels to find circles and collect their IDs
  for (let i = 0; i < data.length; i += 4) {
    // Assuming circles are drawn with a solid color, check if the pixel is not transparent
    if (data[i + 3] !== 0) {
      // Get the ID of the circle from the pixel's color
      const setId = data[i] << 16 | data[i + 1] << 8 | data[i + 2];
      if (!existingCircleIds.includes(setId)) {
        existingCircleIds.push(setId);
      }
    }
  }

  // Return true if there are existing circle IDs, false otherwise
  return existingCircleIds.length > 0;
},

    generateSetId() {
      return Math.floor(Math.random() * 1000) + 1 ;
    },
    async submitCircle() {
      // Call the backend API to submit the circle
      try {
        this.drawCircle();
          
        const requestData = {
          x: this.x,
          y: this.y,
          diameter: this.drawnCircle.diameter,
          color: this.drawnCircle.color,
          setId: this.drawnCircle.setId,
        };
        console.log('Request Data:', requestData);

        const response = await axios.post('https://localhost:8081/api/circle', requestData);
        
        console.log(response.data);
      
        this.lastSubmission.x = this.x;
        this.lastSubmission.y = this.y;
        this.lastSubmission.setId = this.drawnCircle.setId;
      } catch (error) {
        console.error('Error submitting circle:', error);
      }
    },
    async getCirclesBySetId(setId) {
      try {
        const response = await api.getCirclesBySetId(setId);
        console.log('Fetched Circles:', response.data);
        this.drawApiCircles();
        this.existingCircles = response.data || [];
        if (this.existingCircles.length > 0) {
          this.x = this.existingCircles[0].x;
          this.y = this.existingCircles[0].y;
        } else {
          this.x = 0;
          this.y = 0;
        }
      } catch (error) {
        console.error('Error fetching circles:', error);
      }
    }
  }

}
</script>

<style>
canvas {
  border: 1px solid #ddd;
  margin: 100px auto; 
  width: 500px; 
  height: 400px; 
  display: block; 
}

.button {
  background-color: #30c28c; 
  margin: 50px auto 0px auto; 
  color: white;
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
}

.button:hover {
  background-color: #218c74; 
}

#table-container {
  display: flex;
  justify-content: center;
}

#customers {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 50%;
  

}

#customers td, #customers th {
  border: 1px solid #ddd;
  padding: 8px;
}

#customers tr:nth-child(even){background-color: #f2f2f2;}

#customers tr:hover {background-color: #ddd;}

#customers th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align:left;
  background-color: #30c28c;
  color: white;
}
</style>