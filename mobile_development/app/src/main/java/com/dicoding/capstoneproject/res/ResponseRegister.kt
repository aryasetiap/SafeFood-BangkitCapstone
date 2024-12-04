package com.dicoding.capstoneproject.res

import com.google.gson.annotations.SerializedName

class ResponseRegister (

    @field:SerializedName("error")
    val error: Boolean? = null,

    @field:SerializedName("message")
    val message: String? = null
)