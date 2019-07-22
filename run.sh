#!/bin/bash
array=()
while read STRING;
do array+=("$STRING")
done
node sokoban_breadth.js ${array[@]}
echo " "
node sokoban_depth.js ${array[@]}
echo " "
node sokoban_iterative ${array[@]}
