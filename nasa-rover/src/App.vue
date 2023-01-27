<template>
  <div>

    <!-- Initial setup -->
    <div v-if="step === 0">
      <div class="bottom-center">
        <label class="bottom-label">Enter grid size:</label>
        <input type="text" v-model="gridSize" id="gridSize" @keyup.enter="createGrid(), nextStep()" />
      </div>
    </div>

    <!-- Rover 1's turn -->
    <div v-if="currRover === 0">
      <!-- Step 1: Verify rover position -->
      <div class="bottom-center">
        <div v-if="step === 1">
          <label class="bottom-label">Enter rover 1's current position:</label>
          <input type="text" v-model="rovers[currRover].position"/>
        </div>
      </div>

      <!-- Step 2: Enter move instructions -->
      <div class="bottom-center">
        <div v-if="step === 2">
          <label class="bottom-label">Enter rover 1's move instructions:</label>
          <input type="text" v-model="rovers[currRover].instructions" />
        </div>
      </div>
    </div>
      



    
    <table v-if="grid.length">
      <tr v-for="(row, y) in grid" :key="y">
        <td v-for="(cell, x) in row" :key="x">{{ cell }}</td>
      </tr>
    </table>
    <div v-if="i === 1">
      <label>Rover {{ i }}</label>
      <div>
        <label for="position">Enter current position and heading:</label>
        <input type="text" v-model="rovers[i - 1].position" id="position" />
      </div>
      <div>
        <label for="instructions">Enter instructions:</label>
        <input type="text" v-model="rovers[i - 1].instructions" id="instructions" @input="moveRover(i - 1)" />
      </div>
    </div>
  </div>
</template>

<script>
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
    methods: {
      createGrid() {
        let size = this.gridSize.split('x');
        if (size.length === 1) {
          size = this.gridSize.split(" ");
        }
        const rows = Array.from({ length: size[0] }, (_, i) => i);
        const cols = Array.from({ length: size[1] }, (_, i) => i);
        this.grid = rows.map(() => cols.slice());
      },

      nextStep() {
        this.step++;
      },

      moveRover(index) {
        const instructions = this.rovers[index].instructions.split('');
        let [x, y, heading] = this.rovers[index].position.split(' ');
        x = parseInt(x);
        y = parseInt(y);
        instructions.forEach((instruction) => {
          if (instruction === 'L') {
            heading = this.rotateLeft(heading);
          } else if (instruction === 'R') {
            heading = this.rotateRight(heading);
          } else if (instruction === 'M') {
            [x, y] = this.moveForward(x, y, heading);
          }
        });
        this.rovers[index].x = x;
        this.rovers[index].y = y;
        this.rovers[index].heading = heading;
      },
      rotateRight(heading) {
        switch (heading) {
          case "N":
            return "E";
          case "E":
            return "S";
          case "S":
            return "W";
          case "W":
            return "N";
        }
      },
      moveForward(x, y, heading) {
        switch (heading) {
          case "N":
            y++
            break;
          case "E":
            x++
            break;
          case "S":
            y--
            break;
          case "W":
            x--
            break;
        }
        return {x, y}
      },
      rotateLeft(heading) {
        switch (heading) {
          case "N":
            return "W";
          case "W":
            return "S";
          case "S":
            return "E";
          case "E":
            return "N";
        }
      }

    }
  }
</script>

