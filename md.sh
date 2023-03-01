counter=0
declare -A MD_Array
for i in $(find . -name '*.md' -type f -print)
do
   if [[ $i == *"/_schemas/"* ]]; 
     then
       let counter=counter+1;
       Schema_Array[$counter]=$i; 
     else
       tmp=${i##*/}
       name=${tmp%.md} 
       MD_Array[$name]=$i;  
   fi
done
echo ${MD_Array[@]}
echo "schema=${Schema_Array}" >> $GITHUB_ENV
echo "md=${MD_Array}" >> $GITHUB_ENV
echo "${{ env.md }}"
