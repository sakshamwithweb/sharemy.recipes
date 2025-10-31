"use client"

import React, { useEffect, useState } from 'react'
import { Observable } from 'rxjs';
import { Button } from './ui/button';


const DropFile = () => {
    const [file, setFile] = useState();
    const [fileEnter, setFileEnter] = useState(false);
    const [videoUrl, setVideoUrl] = useState()
    const [uploadStatus, setUploadStatus] = useState(0)

    const sleep = (ms)=>{
        return new Promise((resolve)=>{
            setTimeout(() => {
                resolve()
            }, ms);
        })
    }

    const sendAndTrackVid = async (file, signedUrl) => {
        return new Observable((observer) => {
            const xhr = new XMLHttpRequest();
            xhr.open('PUT', signedUrl, true);
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentComplete = Math.round((event.loaded / event.total) * 100);
                    observer.next(percentComplete);
                }
            };
            xhr.onload = () => {
                if (xhr.status === 200) {
                    observer.complete();
                } else {
                    observer.error(`Failed to upload. Server returned status: ${xhr.status}`);
                }
            };

            xhr.send(file);

            // teardown function
            return () => {
                if (xhr.readyState !== XMLHttpRequest.DONE) {
                    xhr.abort();
                }
            };
        })
    }

    const recipeVidUpload = async (file) => {
        if (!file) return
        try {
            const req = await fetch('/api/getSignedUrlForUpload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fileName: file.name,
                    fileType: file.type,
                }),
            });
            const res = await req.json()
            if (!res?.url) return

            const observable = await sendAndTrackVid(file, res.url);
            observable.subscribe({
                next: (progress) => {
                    setUploadStatus(progress);
                },
                complete: () => {
                    setVideoUrl(res.url.split('?')[0]);
                }
            });
        } catch (error) {
            alert("AAAAAAAAAAAA, Error")
            // console.log(error.message)
        }
    }

    useEffect(() => {
        if (file) {
            recipeVidUpload(file)
        }
    }, [file])

    useEffect(() => {
        // console.log(uploadStatus)
    }, [uploadStatus])

    useEffect(() => {
        if (videoUrl) {
            alert("Uploaded")
            // console.log(videoUrl)
        }
    }, [videoUrl])


    const handleDrop = (e) => {
        e.preventDefault();
        setFileEnter(false);
        const droppedFile = e.dataTransfer.items?.[0]?.getAsFile() || e.dataTransfer.files?.[0];
        if (droppedFile) setFile(droppedFile);
    }

    const handleGetRecipe = async () => {
        const req = await fetch("/api/getRecipe", { // Upload video, if done so returns success as true
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ videoUrl: videoUrl }),
        })
        const res = await req.json()
        if (!res.success) return

        while (true) {
            const req1 = await fetch(`/api/getRecipe?video_no=${res.videoNo}`) // Check isparsed, if yes returns success as true
            const res1 = await req1.json()
            if(res1.success) break;
            await sleep(3000)
        }
        console.log("Parsed")

    }

    return (
        <div className='flex flex-col items-center gap-8 justify-center min-h-screen'>
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setFileEnter(true);
                }}
                onDragLeave={(e) => {
                    setFileEnter(false);
                }}
                onDragEnd={(e) => {
                    e.preventDefault();
                    setFileEnter(false);
                }}
                onDrop={handleDrop}
                className={`${fileEnter ? "border-4" : "border-2"
                    } mx-auto  bg-white flex flex-col w-full max-w-xs h-72 border-dashed items-center justify-center`}
            >
                <label
                    htmlFor="file"
                    className="h-full flex flex-col justify-center text-center"
                >
                    {file ? (
                        <>
                            <span className="font-medium">{file.name}</span>
                            <span className="text-sm text-gray-500 mt-1">{videoUrl ? "Uploaded" : "Uploading"}</span>
                        </>
                    ) : (
                        "Click to upload or drag and drop"
                    )}
                </label>
                <input
                    id="file"
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                        let files = e.target.files;
                        if (files && files[0]) {
                            setFile(files[0]);
                        }
                    }}
                />
            </div>
            <Button onClick={handleGetRecipe} disabled={!videoUrl}>Get Recipe</Button>
        </div>
    );
}

export default DropFile