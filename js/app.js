//UIController
var UIController = (function(){
    var DOMElementAccessor = {
            mealItem:"#mealItem",
            calorie:"#calorie",
            mealForm:"#mealForm",
            itemlist:"#itemList",
            totalCalorie:'#totalCalorie',
            updateButton:'#updateMeal',
            backButton:'#back',
            addMeal:'#addMeal'
    }
    return {
        getDOMAccessors:function(){
            return DOMElementAccessor;
        },
        getInput:function(){
            return{
                mealItemValue:$(DOMElementAccessor.mealItem).value.trim(),
                itemCalorie:parseInt($(DOMElementAccessor.calorie).value.trim())
            }
        },
        showItem:function(mealItem,totalCalorie){
           const list = $(DOMElementAccessor.itemlist);
           list.style.display='block';

           const html = `<li id ="item-${mealItem.id}" class="list__item"><strong>${mealItem.itemName}:</strong> <em>${mealItem.calories} Calories</em><span><i parent-id="trash-${mealItem.id}" class="fas fa-trash icon"></i><i parent-id="edit-${mealItem.id}" class="fas fa-pencil-alt icon"></i></span></li>`
           list.insertAdjacentHTML('beforeend',html);
           this.updateTotalCalorieOnUI(totalCalorie);
           this.clearInputFields();
        },
        updateTotalCalorieOnUI(totalCalorie){
            const totalCalorieElement = $(DOMElementAccessor.totalCalorie);
            totalCalorieElement.innerHTML = `<strong>Total Calories:</strong>${totalCalorie}`;
        },
        clearInputFields:function(){
            $(DOMElementAccessor.mealItem).value="";
            $(DOMElementAccessor.calorie).value="";
        },
        checkIfformIsEmpty:function(){
            var input = this.getInput();
            if(!input.mealItemValue && !input.itemCalorie){
                alert('Please Enter Values');
                return false;
            }else{
                return true;
            }
        },
        hideItemList:function(){
            $(DOMElementAccessor.itemlist).style.display='none';
        },
        showListItem:function(){
            $(DOMElementAccessor.itemlist).style.display='block';
        },
        removeListItem:function(id){
            $(id).remove();
        },
        hideEditState:function(){
            $(DOMElementAccessor.addMeal).style.display='inline-block';
            $(DOMElementAccessor.updateButton).style.display='none';
            $(DOMElementAccessor.backButton).style.display='none';
        },
        showEditState:function(){
            $(DOMElementAccessor.addMeal).style.display='none';
            $(DOMElementAccessor.updateButton).style.display='inline-block';
            $(DOMElementAccessor.backButton).style.display='inline-block';
        }
    }
})();

//MealItemController
var MealItemController = (function(){
// Item
  const MealItem = function(id,itemName,calories){
      this.id = id;
      this.itemName = itemName;
      this.calories = calories;
  };

  const data = {
      item:[],
      currentItem:null,
      totalCalorie:0
  };

  return {
      addItem:function(input){
          //calculate id first and then add Item
          let id = data.item.length;
          let mealItem = new MealItem(id,input.mealItemValue,input.itemCalorie);
          data.item.push(mealItem);
          data.currentItem = mealItem;
          data.totalCalorie += mealItem.calories;
      },

      //To Test
      logData:function(){
          console.log(data);
      },

      getData:function(){
          return data;
      },
      updateData:function(){

      },
      removeItem:function(id){
        data.item.forEach(function(current,index){
            if(current.id===id){
               data.item.splice(index,1);
               data.totalCalorie -= current.calories;
               return current;
            //    this.updateData();
            }
        });
      }
  }
})();

//AppController
var AppController = (function(){

    setEventListeners = function(){
        const DOMElementAccessor = UIController.getDOMAccessors();
        const form = $(DOMElementAccessor.mealForm);
        const ul = $(DOMElementAccessor.itemlist);
        const backButton = $(DOMElementAccessor.backButton);
        form.addEventListener('submit',function(e){
            if(UIController.checkIfformIsEmpty()){
               
                MealItemController.addItem(UIController.getInput());
                let data = MealItemController.getData();
                UIController.showItem(data.currentItem,data.totalCalorie);
            }
            e.preventDefault();
        });

        ul.addEventListener('click',function(event){
            const attr = event.target.getAttribute("parent-id");
            
            if(attr){
                const arr = attr.split("-");
                if(arr[0]==='trash'){
                    UIController.removeListItem('#item-'+arr[1]);
                    const item = MealItemController.removeItem(parseInt(arr[1]));
                    UIController.updateTotalCalorieOnUI(MealItemController.getData().totalCalorie);
                     if(MealItemController.getData().item.length===0){
                         UIController.hideItemList();
                     }
                 }else if(attr && arr[0]==='edit'){
                     UIController.showEditState();
                 }
            }
        });
        backButton.addEventListener('click',function(){
            UIController.hideEditState();
        });
    }
    return {
        init:function(){
            console.log('Application started..');
            UIController.hideItemList();
            UIController.hideEditState();
            setEventListeners();
        }
    }

})(UIController,MealItemController);

AppController.init();

function $(accessor){
    return document.querySelector(accessor);
}