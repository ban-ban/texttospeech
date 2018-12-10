
import {Component } from '@angular/core';
import {TextToSpeech} from '@ionic-native/text-to-speech';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { Platform, AlertController} from 'ionic-angular';
import { ChangeDetectorRef} from '@angular/core';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  text: string;
  rate: number;
  locale: string; //=the language
  matches: string[];
  chinese: string;
  
  constructor(private tts: TextToSpeech, private speechRecognition:SpeechRecognition,
     private platform:Platform, private changeDetectorRef: ChangeDetectorRef, private alertCtrl:AlertController) {
    this.text = '';
    this.rate = 10;
    this.locale = 'fr-FR';
    this.matches=["à toi de parler",""];
    this.chinese="cmn-Hans-CN";
    
    }

ionViewDidLoad(){
  if (this.isIos()) {
    this.chinese="zh-CN";
  }
}

isIos(){
  return this.platform.is('ios');
}
//ios only
stop_listening(){
  this.speechRecognition.stopListening().then (()=> {

  })
}


get_permission(){
  this.speechRecognition.hasPermission()
    .then((hasPermission: boolean)=> {
      if (!hasPermission) {
        this.speechRecognition.requestPermission();
      };
    this.start_recording();
      }
    );
}

start_recording() {
  let options={
    language: this.locale,
  //  matches: 3
  }

  this.speechRecognition.startListening(options).subscribe((sentences: string[]) => {

    this.matches[0]=sentences[0];
   
    this.modifyText();
    this.playText();


  });
  this.changeDetectorRef.detectChanges();   //UGLY

  //setInterval(this.playText(), 1500);





}


 modifyText(){
  let newstr=this.matches[0].toString();
  switch (this.locale){
    case "fr-FR" :
      newstr=newstr.replace("Antoine","citrouille et tu a 4 ans");
      newstr=newstr.replace("Mathilde", "carotte et tu fais du trampoline");
      newstr=newstr.replace("Jean-Baptiste", "Jan-Baptiste et tu aimes la musique métal")
      newstr=newstr.replace("Chantal", "Chantal et tu connais le cinéma japonnais")
      newstr=newstr.replace("Jean-Charles", "Jan-Charles et tu es champion du monde de vélo couché")
      newstr=newstr.replace("Alban", "Alban et tu danses le forro");
      newstr=newstr.replace("Thomas","Thomas et tu a une fille de deux ans");
      newstr=newstr.replace("Marlot", "Marlot et ta maman s'appelles Lili");
      newstr=newstr.replace("Julien", "Julien et tu fais du catamaran à Hourtin");
      newstr=newstr.replace("Enzo", "Enzo et tu aimes bien les filles");
      newstr=newstr.replace("Hugo", "Hugo et tu aimes faire la course avec ton frère");
      newstr=newstr.replace("Naomi", "Naomi et tu as de beaux cheveux longs");

      newstr=newstr.replace("j'ai", "tu as");
      newstr=newstr.replace("je m'appelle", "tu tappelles");
      newstr=newstr.replace("non", "si, ")
      
    break;

    case "en-US" :
    newstr=newstr.replace("Hello","Hi");

    break;

    case "de-DE" :
      
    break;

    default :
      console.error ("tipo no soportado");
  }	
  this.matches[1]=newstr;
}

private show_alert(texto:string){
		let alert = this.alertCtrl.create({
	      title:  'Results:' ,
	      message: texto,
	      buttons: [
	        {
	          text: 'Cancel',
	          role: 'cancel',
	          handler: data => {
	            console.log('Cancel clicked');
	          }
	        },
	        {
	          text: 'Ok',
	          handler: data => {
              this.playText();
	            console.log('ok clicked');
	         }
	        }
	      ]
	    });
	    alert.present();
	}

playText() {

    this.tts.speak({
      text: this.matches[1],
      rate: this.rate / 10,
      locale: this.locale
    })
      .then(() => console.log('Success'))
      .catch((reason: any) => console.log(reason));

}

}
