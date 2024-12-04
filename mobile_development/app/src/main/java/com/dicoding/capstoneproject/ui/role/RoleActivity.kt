package com.dicoding.capstoneproject.ui.role

import android.animation.AnimatorSet
import android.animation.ObjectAnimator
import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import com.dicoding.capstoneproject.databinding.ActivityRoleBinding
import com.dicoding.capstoneproject.ui.login.LoginActivity
import com.dicoding.capstoneproject.ui.register.RegisterActivity

class RoleActivity : AppCompatActivity() {

    private lateinit var binding: ActivityRoleBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setupView()
        playAnimation()
        setupAction()
    }

    private fun playAnimation() {

        val donatur = ObjectAnimator.ofFloat(binding.btnDonatur, View.ALPHA, 1f).setDuration(300)
        val penerima = ObjectAnimator.ofFloat(binding.btnPenerima, View.ALPHA, 1f).setDuration(300)
        val title = ObjectAnimator.ofFloat(binding.tvTitleWelcome, View.ALPHA, 1f).setDuration(300)
        val description = ObjectAnimator.ofFloat(binding.tvDescWelcome, View.ALPHA, 1f).setDuration(300)

        val together = AnimatorSet().apply {
            playTogether(donatur, penerima)
        }

        AnimatorSet().apply {
            playSequentially(title, description, together)
            start()
        }
    }

    private fun setupAction() {
        binding.apply {
            btnDonatur.setOnClickListener {
                startActivity(Intent(this@RoleActivity, LoginActivity::class.java))
            }
            btnPenerima.setOnClickListener {
                startActivity(Intent(this@RoleActivity, LoginActivity       ::class.java))
            }
        }
    }

    private fun setupView() {
        binding = ActivityRoleBinding.inflate(layoutInflater)
        setContentView(binding.root)
    }

}