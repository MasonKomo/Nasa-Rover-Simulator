<template>
    <v-app>
        <!-- Initial setup -->
        <div v-if="step === 0">
            <div class="bottom-center">
                <label class="bottom-label">Enter grid size> </label>
                <input type="text" v-model="gridSize" autofocus id="gridSize" @keyup.enter="createGrid()" />
            </div>
        </div>

        <!-- Rover 1's turn -->
        <div v-if="currRover === 0">
            <!-- Step 1: Verify rover position -->
            <div class="bottom-center">
                <div v-if="step === 1">
                    <label class="bottom-label" @focus="onFocus">Enter rover 1's current position> </label>
                    <input ref="R1P" type="text" v-model="position"  @keyup.enter="setRoverPosition(position)"/>
                </div> 
            </div>

            <!-- Step 2: Enter move instructions -->
            <div class="bottom-center">
                <div v-if="step === 2">
                    <label class="bottom-label" @focus="onFocus">Enter rover 1's move instructions> </label>
                    <input ref="R1I" type="text" v-model="instructions" @keyup.enter="moveRover(instructions)"/>
                </div>
            </div>
        </div>
            
        <!-- Rover 2's turn -->
        <div v-else-if="currRover === 1">
            <!-- Step 1: Verify rover position -->
            <div class="bottom-center">
                <div v-if="step === 1">
                    <label class="bottom-label" @focus="onFocus">Enter rover 2's current position> </label>
                    <input ref="R2P" type="text" v-model="position" @keyup.enter="setRoverPosition(position)"/>
                </div>
            </div>

            <!-- Step 2: Enter move instructions -->
            <div class="bottom-center">
                <div v-if="step === 2">
                    <label class="bottom-label" @focus="onFocus">Enter rover 2's move instructions> </label>
                    <input ref="R2I" type="text" v-model="instructions" @keyup.enter="moveRover(instructions)"/>
                </div>
            </div>
        </div>

        <v-container class="parent-container">
            <v-row>
                <v-col cols="8" class="grid-container">
                    <table v-if="grid.length">
                        <tr v-for="(row, y) in grid.slice().reverse()" :key="y">
                            <td v-for="(cell, x) in row" :key="x">{{ cell }}</td>
                        </tr>
                    </table>
                </v-col>

                <v-spacer></v-spacer>
                
                <v-col cols="3" class="report-container">
                    <v-card>
                        <v-list>
                            <v-list-subheader>ROVER LOCATION REPORT</v-list-subheader>
                            <v-list-item
                                v-for="(item, i) in this.items"
                                :key="i"
                                :value="item"
                                active-color="primary"
                                rounded="xl"
                            >
                                <template v-slot:prepend>
                                    <v-text :text="item.icon"></v-text>
                                </template>

                                <v-list-item-title v-text="item.title"></v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-card>
                </v-col>
            </v-row>  
        </v-container>
    </v-app>
</template>

<script>
    export default {
        data() {
            
            return {
                items: [
                ],
                gridSize: '',
                step: 0,
                currRover: 0,
                round: 1,
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
                const rows = Array.from({ length: size[0] }, () => Array.from({ length: size[1] }, () => "[" + "  __  " + "]"));
                this.grid = rows;
                this.nextStep();

                // Set input focus after DOM has been updated.
                this.$nextTick(() => {
                    this.$refs.R1P.focus();
                });

            },

            setRoverPosition(position) {
                let coordinates = position.split(' ');
                if (coordinates.length === 3 && !isNaN(coordinates[0]) && !isNaN(coordinates[1]) && ["N","S","E","W"].includes(coordinates[2])) {
                    // Update the rover's x and y coordinates.
                    this.rovers[this.currRover].x = parseInt(coordinates[0]);
                    this.rovers[this.currRover].y = parseInt(coordinates[1]);
                    this.rovers[this.currRover].heading = coordinates[2];

                    // Verify that position is in bounds
                    if (!(coordinates[0] < this.grid.length && coordinates[1] < this.grid[0].length)) {
                        alert("Rover position is out of bounds");
                        return;
                    }

                    // If it is the first round, we need to check that entered position is [  __  ].
                    if (this.round == 1) {
                        if (this.currRover == 0 && this.grid[coordinates[0]][coordinates[1]] == "[  __  ]") {
                            this.grid[coordinates[0]][coordinates[1]] = "[ 🚗" + this.rovers[this.currRover].heading + " ]";
                            this.nextStep();
                            this.$nextTick(() => {
                                this.$refs.R1I.focus();
                            });
                        }  else if (this.currRover == 1 && this.grid[coordinates[0]][coordinates[1]] == "[  __  ]") {
                            this.grid[coordinates[0]][coordinates[1]] = "[ 🚙" + this.rovers[this.currRover].heading + " ]";
                            this.nextStep();
                            this.$nextTick(() => {
                                this.$refs.R2I.focus();
                            });

                        } else {
                            alert("Rover position must be [  __  ]");
                            return;
                        }
                    } 
                    // For all other rounds.
                    else {
                        // First verify that current position is correct
                        if (this.currRover == 0 && this.grid[coordinates[0]][coordinates[1]] == ("[ 🚗" + this.rovers[this.currRover].heading + " ]")) {
                            
                            this.nextStep();
                            this.$nextTick(() => {
                                this.$refs.R1I.focus();
                            });
                        }  else if (this.currRover == 1 && this.grid[coordinates[0]][coordinates[1]] == ("[ 🚙" + this.rovers[this.currRover].heading + " ]")) {
                            this.nextStep();
                            this.$nextTick(() => {
                                this.$refs.R2I.focus();
                            });
                        } else {
                            console.log("Entered position doesn't match actual rover position.");
                            return;
                        }
                    }
                }
            },

            resetStep() {
                this.step = 1;
            },

            nextStep() {
                this.step++;
            },

            nextRound() {
                this.round++;
            },

            onFocus() {
                this.value = '';
            },

            // Function to move rover based on the given instructions and update its position on the board and reports.
            moveRover(instructions) {
                let x = this.rovers[this.currRover].x;
                let y = this.rovers[this.currRover].y;
                let heading = this.rovers[this.currRover].heading;
                
                // Calculate Rover Move
                for (let i = 0; i < instructions.length; i++) {
                    if (instructions[i] === "L") {
                        this.rovers[this.currRover].heading = this.rotateLeft(heading);
                        heading = this.rotateLeft(heading);
                    } else if (instructions[i] === "R") {
                        this.rovers[this.currRover].heading = this.rotateRight(heading);
                        heading = this.rotateRight(heading);
                    } else if (instructions[i] === "M") {
                        let newPosition = this.moveForward(x, y, this.rovers[this.currRover].heading);

                        // Check if new position is out of bounds
                        if (newPosition.x < 0 || newPosition.x > this.grid.length - 1 || newPosition.y < 0 || newPosition.y > this.grid[0].length - 1) {
                            alert("Error: attempted to move Rover out of bounds.");
                            return;
                        }

                        // Check if new position is occupied
                        if (this.grid[newPosition.x][newPosition.y] !== "[  __  ]") {
                            alert("Error: attempted to move Rover to an occupied position.");
                            return;
                        }

                        // Clear previous position and update Rover's coordinates.
                        this.grid[x][y] = "[ __ ]";
                        x = newPosition.x;
                        y = newPosition.y;
                    } else {
                        alert("Error: invalid instruction.");
                        return;
                    }
                }

                // Update Rover's actual position on the board.
                this.rovers[this.currRover].x = x;
                this.rovers[this.currRover].y = y;
                this.rovers[this.currRover].heading = heading;

                this.grid[x][y] = this.currRover == 0 ? ("[ 🚗" + this.rovers[this.currRover].heading + " ]") : ("[ 🚙" + this.rovers[this.currRover].heading + " ]");

                if (this.currRover == 0) {
                    this.resetStep();
                    this.currRover = 1;
                    this.$nextTick(() => {
                        this.$refs.R2P.focus();
                    });
                } else {
                    // Print report for first rover.
                    this.items.push({
                        icon: "🚗",
                        title: "🚗 Rover " + this.currRover + ": " + this.rovers[this.currRover - 1].x + " " + this.rovers[this.currRover - 1].y + " " + this.rovers[this.currRover - 1].heading,
                    });

                    // Print report for second rover.
                    this.items.push({
                        icon: "🚙",
                        title: "🚙 Rover " + (this.currRover + 1) + ": " + this.rovers[this.currRover].x + " " + this.rovers[this.currRover].y + " " + this.rovers[this.currRover].heading,
                    });

                    this.items.push({
                        title: "------------------ ",
                    });

                    this.currRover = 0;
                    this.nextRound();
                    this.resetStep();

                    this.$nextTick(() => {
                        this.$refs.R1P.focus();
                    });
                }
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
                        x++
                        break;
                    case "E":
                        y++
                        break;
                    case "S":
                        x--
                        break;
                    case "W":
                        y--
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
            },
        }
    }
</script>

    