/**
 * Copyright 2026 dylanhorton21
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `counter-app`
 * 
 * @demo index.html
 * @element counter-app
 */
export class CounterApp extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "counter-app";
  }

  constructor() {
    super();
    this.title = "";
    this.t = this.t || {};
    this.t = {
      ...this.t,
      title: "Title",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/counter-app.ar.json", import.meta.url).href +
        "/../",
    });
    // default param
    this.min = 0;
    this.max = 25;
    this.counter = 0;

  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      // reactive default params 
      counter: {type: Number, reflect: true},
      min: {type: Number, reflect :true},
      max: {type: Number, reflect: true},
    };
  }

  // Lit scoped styles, uses DDD to et colors
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        color: var(--ddd-theme-primary);
        background-color: var(--ddd-theme-accent);
        font-family: var(--ddd-font-navigation);
      }
      .wrapper {
        margin: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-4);
      }
      h3 span {
        font-size: var(--counter-app-label-font-size, var(--ddd-font-size-s));
      }
      h3{margin: 0 0 var(--ddd-spacing-4) 0;
      font-size: var(--ddd-font-size-xxl);}
      .buttons{
        display: inline-flex;
        gap: var(--ddd-spacing-2);
      }
      button{
        width: 64px;
        height: 48px;
        font-size: 24px;
        border-radius: 12px;
        border: 2px solid var(--ddd-theme-default-wonderPurple);
        background: var(--ddd-theme-default-white);
        cursor: pointer;
      }
      button:hover{
        box-shadow: var(--ddd-boxShadow-sm);
      }
      button:focus-visible{
        outline:3px solid var(--ddd-theme-default-skyBlue);
        outline-offset: 2px;
      }
      button:disabled{
        opacity: .5;
        cursor: not-allowed;
      }

    `];
  }

  // Lit render the HTML

  // makes increment and decrement buttons and counter display
  render() {
    return html`
    <confetti-container id="confetti">
      <div class = "wrapper">
       <h3 style="color:${this.getNumberColor()};">
        ${this.counter}</h3>
        <div class = "buttons">
          <button
          @click=${this.decrement} ?disabled=${this.min ===this.counter}>
          -
        </button>
        <button
        @click=${this.increment} ?disabled=${this.max ===this.counter}>
        +
      </button>
        </div>
        <slot></slot>
       </div>
      </confetti-container>
      `;
  }
  // if number is less than max, it will increase
  increment(){
    if (this.counter < this.max) {
      this.counter++;
    }
  }
  // if number is above the min, it decreases
  decrement(){
    if(this.counter > this.min){
      this.counter--;
    }
  }
  //changes colors of number based on what the number is at that time
  getNumberColor(){
    if (this.counter === this.min || this.counter === this.max){
      return "var(--ddd-theme-default-landgrantBrown)";
    }
    if (this.counter === 18){
      return "var(--ddd-theme-default-skyBlue)";
    }
    if (this.counter === 21){
      return "var(--ddd-theme-default-keystoneYellow)";
    }
    return "var(--ddd-theme-default-wonderPurple)";
  }

// detects when counter changes
updated(changedProperties) {
  if (super.updated) {
    super.updated(changedProperties);
  }
  if (changedProperties.has('counter')) {
   if(this.counter === 21){
    this.makeItRain();
   }
    // if the counter hits 21, make it rain is called
  }
}
// uses the outside code to make the confetti
makeItRain() {
  // this is called a dynamic import. It means it won't import the code for confetti until this method is called
  // the .then() syntax after is because dynamic imports return a Promise object. Meaning the then() code
  // will only run AFTER the code is imported and available to us
  import("@haxtheweb/multiple-choice/lib/confetti-container.js").then(
    (module) => {
      // This is a minor timing 'hack'. We know the code library above will import prior to this running
      // The "set timeout 0" means "wait 1 microtask and run it on the next cycle.
      // this "hack" ensures the element has had time to process in the DOM so that when we set popped
      // it's listening for changes so it can react
      setTimeout(() => {
        // forcibly set the poppped attribute on something with id confetti
        // while I've said in general NOT to do this, the confetti container element will reset this
        // after the animation runs so it's a simple way to generate the effect over and over again
        this.shadowRoot.querySelector("#confetti").setAttribute("popped", "");
      }, 0);
    }
  );
}



  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(CounterApp.tag, CounterApp);