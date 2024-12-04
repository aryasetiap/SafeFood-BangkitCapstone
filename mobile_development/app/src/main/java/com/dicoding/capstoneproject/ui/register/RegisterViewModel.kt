package com.dicoding.capstoneproject.ui.register

import androidx.lifecycle.LiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.dicoding.capstoneproject.data.database.Repository
import com.dicoding.capstoneproject.data.inject.Event
import com.dicoding.capstoneproject.res.ResponseRegister
import kotlinx.coroutines.launch

class RegisterViewModel (private val repository: Repository) : ViewModel() {
    val registerResponse: LiveData<ResponseRegister> = repository.registerResponse
    val toastText: LiveData<Event<String>> = repository.toastText

    fun dataRegister(name: String, email: String, password: String) {
        viewModelScope.launch {
            repository.postRegister(name, email, password)
        }
    }
}