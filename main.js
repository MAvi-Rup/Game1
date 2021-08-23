//Data
//Crud(Read)
//UI-CRUD
//LocalStorage-CRUD
//Step to devleop the application
//Application Data Workflow
//Requirments (get weather data from api and Display in UI)
//Design
//Code
//Start Developing...

//Object Wise Divide

//LocalStorage Object
const storage={
    city:'',
    country:'',
    saveItem(){
        localStorage.setItem('weatherApp-city',this.city)
        localStorage.setItem('weatherApp-country',this.country)
    },
    getItem(){
        this.city= localStorage.getItem('weatherApp-city')
        this.country= localStorage.getItem('weatherApp-country')
    }
}
//Weather Data Handiling Object
const weatherData={
    city: '',
    country: '',
    API_KEY: 'a89b6a71717733c168f7c572108ab293',
    async getWeather(){
        try{
            const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.city},${this.country}&units=metric&appid=${this.API_KEY}`)
            const data = await res.json()
            //const {main,weather,name}=data
            return{
                data
            }
        }catch(err){
           UI.showMessage(err)
        }
    }

}

//UI Object
const UI={
    loadSelector() {
        const cityElm = document.querySelector('#city')
        const cityInfoElm = document.querySelector('#w-city')
        const iconElm = document.querySelector('#w-icon')
        const temperatureElm = document.querySelector('#w-temp')
        const pressureElm = document.querySelector('#w-pressure')
        const humidityElm = document.querySelector('#w-humidity')
        const feelElm = document.querySelector('#w-feel')
        const formElm = document.querySelector('#form')
        const countryElm = document.querySelector('#country')
        const messageElm = document.querySelector('#messageWrapper')
    
        return {
          cityInfoElm,
          cityElm,
          countryElm,
          iconElm,
          temperatureElm,
          pressureElm,
          feelElm,
          humidityElm,
          formElm,
          messageElm
        }
    },

    //Message part
    showMessage(msg){
        const{}= this.loadSelector()
        const elm= `
        <div class="alert alert-danger" id="message">
          ${msg}
        </div>
        `
        messageElm.insertAdjacentHTML('afterbegin',elm)
    },
    hideMessage(){
        const messageElm = document.querySelector('#message').remove()
        setTimeout(() => {
            if(messageElm){
                messageElm.remove
            }

        },2000)

    },

    //validation Check
    validateInput(city,country){
        if(country===''||city === ''){
            this.showMessage('Please Provide validate Country and city')
            return false

        }else{
            return true;
        }
    },
 
    //GetElementPart
    getInputValue(){
        const{cityElm,countryElm}=this.loadSelector()
        const country=countryElm.value
        const city = cityElm.value
        const isValid=this.validateInput(city,country)
        if(isValid){
            //sending Api Request with nesseary data.
            weatherData.city=city
            weatherData.country=country
            //setting to localstorage
            storage.city=city
            storage.country=country
            //saving
            storage.saveItem()
            
        }
    },
    getIcon(iconCode){
        return 'https://openweathermap.org/img/w/' + iconCode + '.png'
        
    },
    printWeather(weatherData){
        const{main,weather,name: cityName}=weatherData
        //print inti UI
        const{cityInfoElm,temperatureElm,pressureElm,humidityElm,feelElm,iconElm}=this.loadSelector()
        cityInfoElm.textContent=cityName
        temperatureElm.textContent=`Temperature: ${main.temp} C`
        pressureElm.textContent=`Pressure: ${main.pressure} Kpa`
        humidityElm.textContent=`Humidity: ${main.humidity}`
        feelElm.textContent=weather[0].description
        iconElm.setAttribute('src', this.getIcon(weather[0].icon))

    },
    resetInput(){
        const{cityElm,countryElm}=this.loadSelector()
        cityElm.value=''
        countryElm.value=''
    },

        init(){
            const{formElm}=this.loadSelector()
            formElm.addEventListener('submit',async e =>{
                e.preventDefault()
                //get the valus from input
                this.getInputValue()

                //resetINput
                this.resetInput()
                //sending Api Request
                const {data} = await weatherData.getWeather()
                if(data.cod==='404'){
                    UI.showMessage(data.message)
                }else{
                    UI.printWeather(data)
                }
            })
            window.addEventListener('DOMContentLoaded',async ()=>{
               storage.getItem()
               const city=storage.city
               const country=storage.country

               weatherData.city = city ? city:'Dhaka'
               weatherData.country=country ? country:'BD'

               //weatherData.getWeather()
               const {data} = await weatherData.getWeather()
               if(data.cod==='404'){
                   UI.showMessage(data.message)
               }else{
                  
                   UI.printWeather(data)
               }
            })

        }
}
UI.init()





