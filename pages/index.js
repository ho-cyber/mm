import Head from 'next/head'
import Image from 'next/image'
import axios from "axios"
import React from "react"
import { Configuration, OpenAIApi } from "openai";
const config = new Configuration({ apiKey: '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' });
const openai = new OpenAIApi(config);
import logo from "../logo.png"
export default function Home() {
  const [imageAnimation, changeImageAnimation] = React.useState()
  const [input, changeInput] = React.useState()
  const [loading, changeLoading] = React.useState(false)
  const [text, changeText] = React.useState()

  async function generateImage() {
    changeLoading(true)

    const prompt = `
    Generate a hilarious meme based off of the following prompt and format:

    ${input}.

    Caption.
    Image.
    `;

        
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 1443,
        temperature: 0.9
    });

    const object = completion.data.choices[0].text?.split("\n")
    changeText(object[1].replace("Caption:", ""))
    const image = object[2].replace("Image:", "")
    console.log(image, text, object)

    var data = JSON.stringify({
      "prompt": image,
      "n": 1,
      "size": "1024x1024"
    });
    
    var config = {
      method: 'post',
      url: 'https://api.openai.com/v1/images/generations',
      headers: { 
        'Authorization': 'Bearer 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', 
        'Content-Type': 'application/json'
      },
      data : data
    };
    
    axios(config)
    .then(function (response) {
      changeLoading(false)
      changeImageAnimation(response.data.data[0].url);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  function changeInputFunction(e) {
    changeInput(e.target.value)
  }


  return (
    
    <div className="main">
      <header>
        <Image src={logo} width={100} height = {100}/>
      </header>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>


      <h1>Generate A Meme!</h1>
      <input type="text" placeholder='Generate a Meme-licious meme!!' onChange={changeInputFunction} />
      <button onClick={generateImage}>Make me Laugh!!</button>
      { (imageAnimation && loading == false) &&
        <div className="images">
          <p className="prompt">{text}</p>
          <img src={imageAnimation} />
        </div>
      }
      { loading &&
        <div className="loader"></div>
      }
    </div>
  )
}
