import React,{useRef, useState} from 'react';
import {SketchField, Tools} from 'react-sketch'
import {Button, Alert} from 'react-bootstrap'
import {saveAs} from 'file-saver'
import axios from 'axios';


const styles={
    draw:{
        alignItems:'center'
    }
}

const Draw = () => {
    const [send, setSend] = useState(false)
    const [result, setResult] = useState()
    const sketch = useRef()

    const handleSubmit = () =>{
        const canvas = sketch.current.toDataURL()
        // saveAs(canvas,'digit.jpg')
        sendData(canvas)
    }
    const handleReset = () =>{
        sketch.current.clear()
        sketch.current._backgroundColor('black')
        setSend(false)
        setResult()
    }
    const handleUpload = (e) =>{
        e.preventDefault();
        let file = e.target.files[0];
        const formdata = new FormData();
        formdata.append('file', file);
            
        for (var value of formdata.values()) {
            console.log(value);
        }
        
        const url = 'http://127.0.0.1:8000/uploaddigits';
        fetch(url, {
            method: 'POST',
            body: formdata,
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then(res => console.log(res.data))
        .catch(error => console.log(error));
    }
    const sendData = (c) =>{
        console.log(c)

        const headers = {
            'accept':'application/json'
        }

        const fd = new FormData()
        fd.append('image', c)

        axios.post('http://127.0.0.1:8000/apidigits/', fd, {headers:headers})
        .then(res=>{
            console.log(res.data)
            setSend(true)
            getImageResult(res.data.id)
        })
        .catch(err=>console.log(err))
    }
    const getImageResult = (id) => {
        axios.get(`http://127.0.0.1:8000/apidigits/${id}/`)
        .then(res=>{
            setResult(res.data.result)
        })
    }
    return (
        <React.Fragment>
            {send && <Alert variant="info">Succesfully saved for classification</Alert>}
            {result && <h3>Result is {result}</h3>}
            <center>
            <SketchField
                ref={sketch}
                width='800px'
                height='800px'
                styles={styles.draw}
                tool={Tools.Pencil}
                backgroundColor='black'
                lineColor='white'
                imageFormat='jpg'
                lineWidth={30}
            />
            </center>
            <div className="mt-3">
                <Button onClick={handleSubmit} variant='primary'>Save</Button>
                <Button onClick={handleReset} variant='secondary'>Reset</Button>
            </div>
            <input type="file" onChange={handleUpload}/>
        </React.Fragment>
    );
}
export default Draw;