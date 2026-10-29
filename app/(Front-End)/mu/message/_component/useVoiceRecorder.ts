"use client";

import { useEffect, useRef, useState } from "react";
import { Mp3Encoder } from "@breezystack/lamejs";

export function useVoiceRecorder(
  onSend?: (blob: Blob) => Promise<void> | void,
) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const mp3EncoderRef = useRef<Mp3Encoder | null>(null);
  const mp3ChunksRef = useRef<BlobPart[]>([]);
  const onSendRef = useRef(onSend);
  onSendRef.current = onSend;

  useEffect(() => {
    return () => {
      if (recorderTimerRef.current) clearInterval(recorderTimerRef.current);
      audioContextRef.current?.close();
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioCtx = window.AudioContext;
      const audioContext = new AudioCtx();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      const encoder = new Mp3Encoder(1, audioContext.sampleRate, 128);
      const silenceGain = audioContext.createGain();
      silenceGain.gain.value = 0;

      processorRef.current = processor;
      mp3EncoderRef.current = encoder;
      mp3ChunksRef.current = [];

      processor.onaudioprocess = (e) => {
        const pcm = e.inputBuffer.getChannelData(0);
        const ints = new Int16Array(pcm.length);
        for (let i = 0; i < pcm.length; i++) {
          ints[i] = Math.max(-1, Math.min(1, pcm[i])) * 0x7fff;
        }
        const mp3 = encoder.encodeBuffer(ints);
        if (mp3.length > 0) mp3ChunksRef.current.push(new Uint8Array(mp3));
      };

      source.connect(processor);
      processor.connect(silenceGain);
      silenceGain.connect(audioContext.destination);

      setIsRecording(true);
      setRecordingSeconds(0);
      recorderTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Failed to start voice recording", error);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recorderTimerRef.current) {
      clearInterval(recorderTimerRef.current);
      recorderTimerRef.current = null;
    }

    const processor = processorRef.current;
    const encoder = mp3EncoderRef.current;
    const audioContext = audioContextRef.current;
    const stream = streamRef.current;
    if (!processor || !encoder || !audioContext) return;

    setTimeout(() => {
      processor.disconnect();
      const tail = encoder.flush();
      if (tail.length > 0) mp3ChunksRef.current.push(new Uint8Array(tail));
      const blob = new Blob(mp3ChunksRef.current, { type: "audio/mp3" });
      processorRef.current = null;
      mp3EncoderRef.current = null;
      audioContextRef.current = null;
      audioContext.close();
      stream?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      if (blob.size > 0) setRecordingBlob(blob);
    }, 300);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const sendRecording = async () => {
    if (!recordingBlob) return;
    await onSendRef.current?.(recordingBlob);
    setRecordingBlob(null);
  };

  const discardRecording = () => {
    setRecordingBlob(null);
  };

  const formatRecordingTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return {
    isRecording,
    recordingSeconds,
    recordingBlob,
    toggleRecording,
    sendRecording,
    discardRecording,
    formatRecordingTime,
  };
}
