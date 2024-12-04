package com.dicoding.capstoneproject.ui.login

import androidx.lifecycle.LiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.dicoding.capstoneproject.data.database.Repository
import com.dicoding.capstoneproject.data.inject.Event
import com.dicoding.capstoneproject.data.preference.SessionModel
import com.dicoding.capstoneproject.res.ResponseLogin
import kotlinx.coroutines.launch

class LoginViewModel (private val repository: Repository) : ViewModel() {
    val loginResponse: LiveData<ResponseLogin> = repository.loginResponse
    val toastText: LiveData<Event<String>> = repository.toastText

    fun postLogin(email: String, password: String) {
        viewModelScope.launch {
            repository.afterLogin(email, password)
        }
    }

    fun saveSession(session: SessionModel) {
        viewModelScope.launch {
            repository.saveSession(session)
        }
    }

    fun login() {
        viewModelScope.launch {
            repository.login()
        }
    }
}