import React, { useEffect, useState } from 'react'
import { Observable } from 'rxjs';
import { Button } from './ui/button';
import {ProgressBar} from './ProgressBar'

const DropFile = ({ setRecipe }) => {
    const [file, setFile] = useState();
    const [fileEnter, setFileEnter] = useState(false);
    const [videoUrl, setVideoUrl] = useState()
    const [uploadProgress, setUploadProgress] = useState(0)
    const [btnLoading, setBtnLoading] = useState(false)
    const [recipeStatus, setRecipeStatus] = useState("")

    const sleep = (ms) => {
        return new Promise((resolve) => {
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
                    setUploadProgress(progress);
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

    const handleDrop = (e) => {
        e.preventDefault();
        setFileEnter(false);
        const droppedFile = e.dataTransfer.items?.[0]?.getAsFile() || e.dataTransfer.files?.[0];
        if (droppedFile) setFile(droppedFile);
    }

    const handleGetRecipe = async () => {
        setBtnLoading(true)
        setRecipeStatus("Reading")
        const req = await fetch("/api/getRecipe", { // Upload video, if done so returns success as true
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ videoUrl: videoUrl }),
        })
        const res = await req.json()
        if (!res.success) return

        setRecipeStatus("Parsing")
        while (true) {
            const req1 = await fetch(`/api/getRecipe?video_no=${res.videoNo}`) // Check isparsed, if yes returns success as true
            const res1 = await req1.json()
            if (res1.success) break;
            await sleep(3000)
        }

        setRecipeStatus("Generating")
        const req3 = await fetch("/api/getRecipe", { // Generate Recipe
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ videoNo: res.videoNo }),
        })
        const res3 = await req3.json()
        if (!res3.success) return
        setBtnLoading(false)
        setRecipe(res3.recipe)
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
                            {!videoUrl&&<ProgressBar progress={uploadProgress} />}
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
            <Button onClick={handleGetRecipe} disabled={!videoUrl || btnLoading}>{btnLoading?<><div className="w-3 h-3 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>{recipeStatus}</>:"Get Recipe"}</Button>
        </div>
    );
}

export default DropFile