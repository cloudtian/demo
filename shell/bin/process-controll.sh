#!/bin/bash

int=1
while(( $int<=5))
do
    echo $int
    let "int++"
done

#Bash let 命令，它用于执行一个或多个表达式，变量计算中不需要加上 $ 来表示变量


count=0
echo '按下 <CTRL-D> 退出'
echo -n '输入名字：'
while read NAME
do
    echo "Yes, $NAME is a good name."
    if [ $count -eq 3 ]
    then
        break
    else
        count=`expr $count + 1`
    fi
done


a=0
until [ ! $a -lt 10 ]
do
   echo $a
   a=`expr $a + 1`
done


echo '输入1到4之间的数字：'
echo '你输入的数字为：'
read aNum
case $aNum in
    1) echo '你选择了1'
    ;;
    2) echo '你选择了2'
    ;;
    3) echo '你选择了3'
    ;;
    4) echo '你选择了4'
    ;;
    *) echo '你没有输入1到4之间的数字'
    ;;
esac

#使用break
while :
do
    echo -n "输入1-5之间的数字："
    read aNum
    case $aNum in
        1|2|3|4|5) echo "你输入的数字为$aNum！"
        ;;
        *) echo "你没有输入1到5之间的数字！结束"
            break
        ;;
    esac
done

