
//UIController
var UIController = (function(){
    var DOMElementAccessor = {
            mealItem:"#mealItem",
            calorie:"#calorie",
            mealForm:"#mealForm",
            itemlist:"#itemList",
            totalCalorie:'#totalCalorie'
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
           const totalCalorieElement = $(DOMElementAccessor.totalCalorie);
           if(!list.classList.contains('list'))list.classList.add('list');
           const html = `<li class="list__item"><strong>${mealItem.itemName}:</strong> <em>${mealItem.calories} Calories</em><span><i class="fas fa-trash icon"></i></span></li>`
           list.insertAdjacentHTML('beforeend',html);
           totalCalorieElement.innerHTML = `<strong>Total Calories:</strong>${totalCalorie}`;
           this.clearInputFields();
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
      }
  }
})();

//AppController
var AppController = (function(){

    setEventListeners = function(){
        const DOMElementAccessor = UIController.getDOMAccessors();
        const form = $(DOMElementAccessor.mealForm);
        form.addEventListener('submit',function(e){
            if(UIController.checkIfformIsEmpty()){
                console.log(UIController.getInput());
                MealItemController.addItem(UIController.getInput());
                let data = MealItemController.getData();
                UIController.showItem(data.currentItem,data.totalCalorie);
            }
            e.preventDefault();
        });
    }
    return {
        init:function(){
            console.log('Application started..');
            setEventListeners();
        }
    }

})(UIController,MealItemController);

AppController.init();

function $(accessor){
    return document.querySelector(accessor);
}